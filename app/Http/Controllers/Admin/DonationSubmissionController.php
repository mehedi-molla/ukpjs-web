<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Ledger\CreateTransactionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DonationSubmissionFilterRequest;
use App\Http\Requests\Admin\ReviewDonationSubmissionRequest;
use App\Models\DonationSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DonationSubmissionController extends Controller
{
    public function index(DonationSubmissionFilterRequest $request): Response
    {
        $filters = $request->validated();
        $query = DonationSubmission::query()->with('project:id,title_bn,title_en')->latest();
        $query->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(fn ($inner) => $inner->where('donor_name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%")->orWhere('reference_no', 'like', "%{$search}%")));
        $query->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status));
        $query->when($filters['fund_type'] ?? null, fn ($query, string $fundType) => $query->where('fund_type', $fundType));

        return Inertia::render('Admin/DonationSubmissions', ['filters' => $filters, 'submissions' => $query->paginate(25)->withQueryString()->through(fn (DonationSubmission $submission): array => [
            'id' => $submission->id, 'donorName' => $submission->is_anonymous ? null : $submission->donor_name, 'amount' => (float) $submission->amount,
            'fundType' => $submission->fund_type, 'paymentMethod' => $submission->payment_method, 'referenceNo' => $submission->reference_no,
            'projectName' => $submission->project?->title_bn, 'status' => $submission->status, 'createdAt' => $submission->created_at?->toIso8601String(),
        ])]);
    }

    public function review(ReviewDonationSubmissionRequest $request, DonationSubmission $submission, CreateTransactionAction $action): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $submission, $request, $action): void {
            abort_unless($submission->status === 'pending', 422, 'Only pending donation confirmations can be reviewed.');
            $submission->update(['status' => $validated['status'], 'reviewed_by' => $request->user()->id, 'reviewed_at' => now()]);

            if ($validated['status'] === 'approved') {
                $action->handle([
                    'type' => 'income', 'fund_type' => $submission->fund_type, 'amount' => $submission->amount,
                    'occurred_at' => now()->toDateString(), 'project_id' => $submission->project_id,
                    'donor_name' => $submission->is_anonymous ? null : $submission->donor_name, 'is_anonymous' => $submission->is_anonymous,
                    'payment_method' => $submission->payment_method, 'reference_no' => $submission->reference_no,
                    'category_id' => 'public-donation-confirmation', 'category_name' => 'Public donation confirmation',
                    'description' => $submission->notes,
                ], $request->user());
            }
        });

        return back()->with('success', 'Donation confirmation reviewed and ledger synchronized.');
    }
}
