<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Ledger\CreateTransactionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReviewWelfareRequest;
use App\Http\Requests\Admin\WelfareFilterRequest;
use App\Models\AuditLog;
use App\Models\WelfareRequest as WelfareRequestModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WelfareController extends Controller
{
    public function index(WelfareFilterRequest $request): Response
    {
        $filters = $request->validated();
        $query = WelfareRequestModel::query()->latest();
        $query->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(fn ($inner) => $inner->where('tracking_no', 'like', "%{$search}%")->orWhere('applicant_name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%")->orWhere('village', 'like', "%{$search}%")));
        $query->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status));
        $query->when($filters['assistance_type'] ?? null, fn ($query, string $type) => $query->where('assistance_type', 'like', "%{$type}%"));

        return Inertia::render('Admin/Welfare', ['filters' => $filters, 'requests' => $query->paginate(25)->withQueryString()->through(fn (WelfareRequestModel $request): array => [
            'id' => $request->id, 'trackingNo' => $request->tracking_no, 'applicantName' => $request->applicant_name,
            'phone' => $request->phone, 'village' => $request->village, 'assistanceType' => $request->assistance_type,
            'description' => $request->description, 'requestedAmount' => (float) $request->requested_amount,
            'approvedAmount' => $request->approved_amount ? (float) $request->approved_amount : null, 'status' => $request->status,
            'verificationNotes' => $request->verification_notes, 'createdAt' => $request->created_at?->toIso8601String(),
        ])]);
    }

    public function update(ReviewWelfareRequest $request, WelfareRequestModel $welfareRequest, CreateTransactionAction $action): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $welfareRequest, $request, $action): void {
            $wasDisbursed = $welfareRequest->status === 'disbursed';
            $welfareRequest->update([
                'status' => $validated['status'], 'approved_amount' => $validated['approved_amount'] ?? $welfareRequest->approved_amount,
                'verification_notes' => $validated['verification_notes'] ?? null, 'reviewed_by' => $request->user()->id,
                'disbursed_date' => $validated['status'] === 'disbursed' ? now()->toDateString() : $welfareRequest->disbursed_date,
            ]);

            if ($validated['status'] === 'disbursed' && ! $wasDisbursed) {
                $amount = $validated['approved_amount'] ?? $welfareRequest->approved_amount;
                abort_if(! $amount, 422, 'An approved amount is required before disbursement.');
                $action->handle([
                    'type' => 'expense', 'fund_type' => $validated['fund_type'], 'category_id' => 'welfare-'.$welfareRequest->id,
                    'category_name' => 'Welfare assistance', 'amount' => $amount, 'occurred_at' => now()->toDateString(),
                    'payment_method' => 'cash', 'description' => 'Welfare disbursement '.$welfareRequest->tracking_no,
                    'paid_to' => $welfareRequest->applicant_name.' ('.$welfareRequest->village.')',
                ], $request->user());
            }
        });

        return back()->with('success', 'Welfare request updated safely.');
    }

    public function destroy(WelfareRequestModel $welfareRequest, Request $request): RedirectResponse
    {
        $trackingNo = $welfareRequest->tracking_no;
        $applicantName = $welfareRequest->applicant_name;

        $welfareRequest->delete();

        \App\Models\AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'deleted',
            'module' => 'welfare',
            'record_type' => WelfareRequestModel::class,
            'record_id' => (string) $welfareRequest->id,
            'details' => "Welfare request '{$trackingNo}' for {$applicantName} permanently deleted.",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Welfare request deleted successfully.');
    }
}
