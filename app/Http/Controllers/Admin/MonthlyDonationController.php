<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Ledger\CreateTransactionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MarkMonthlyDonationPaidRequest;
use App\Http\Requests\Admin\MonthlyDonationFilterRequest;
use App\Http\Requests\Admin\StoreMonthlyDonationRequest;
use App\Models\AuditLog;
use App\Models\Member;
use App\Models\MonthlyDonation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MonthlyDonationController extends Controller
{
    public function index(MonthlyDonationFilterRequest $request): Response
    {
        $filters = $request->validated();
        $query = MonthlyDonation::query()->with(['member:id,member_no,name_bn,name_en', 'transaction:id,voucher_no,status'])->latest('year')->latest('month');
        $query->when($filters['year'] ?? null, fn ($query, int $year) => $query->where('year', $year));
        $query->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status));
        $query->when($filters['search'] ?? null, function ($query, string $search): void {
            $query->whereHas('member', fn ($memberQuery) => $memberQuery->where('member_no', 'like', "%{$search}%")->orWhere('name_bn', 'like', "%{$search}%")->orWhere('name_en', 'like', "%{$search}%"));
        });

        return Inertia::render('Admin/MonthlyDonationManagement', ['filters' => $filters, 'donations' => $query->paginate(30)->withQueryString()->through(fn (MonthlyDonation $donation): array => [
            'id' => $donation->id, 'memberNo' => $donation->member?->member_no, 'memberName' => $donation->member?->name_en ?? $donation->member?->name_bn,
            'month' => $donation->month, 'year' => $donation->year, 'expectedAmount' => (float) $donation->expected_amount,
            'paidAmount' => (float) $donation->paid_amount, 'paymentDate' => $donation->payment_date?->toDateString(), 'status' => $donation->status,
            'voucherNo' => $donation->transaction?->voucher_no ?? $donation->voucher_no, 'transactionId' => $donation->transaction_id,
        ]), 'members' => Member::query()->where('is_active', true)->orderBy('member_no')->get(['id', 'member_no', 'name_bn', 'name_en', 'monthly_pledge_amount'])->map(fn (Member $member): array => [
            'id' => $member->id, 'memberNo' => $member->member_no, 'name' => $member->name_en ?? $member->name_bn, 'pledge' => (float) $member->monthly_pledge_amount,
        ])->values()]);
    }

    public function store(StoreMonthlyDonationRequest $request): RedirectResponse
    {
        MonthlyDonation::create([
            ...$request->validated(), 'paid_amount' => 0, 'status' => 'pending',
        ]);

        return back()->with('success', 'Monthly donation commitment created. Record payment separately in the central ledger.');
    }

    public function markPaid(MonthlyDonation $monthlyDonation, MarkMonthlyDonationPaidRequest $request, CreateTransactionAction $create): RedirectResponse
    {
        $validated = $request->validated();

        abort_if($monthlyDonation->transaction_id, 422, 'This monthly commitment already has a ledger payment.');

        $transaction = DB::transaction(function () use ($monthlyDonation, $validated, $request, $create) {
            $monthlyDonation = MonthlyDonation::query()->lockForUpdate()->findOrFail($monthlyDonation->id);
            abort_if($monthlyDonation->transaction_id, 422, 'This monthly commitment already has a ledger payment.');

            $transaction = $create->handle([
                'type' => 'income', 'fund_type' => 'monthly_donation', 'category_id' => 'monthly-donation',
                'category_name' => 'Monthly donation', 'amount' => $validated['amount'],
                'occurred_at' => $validated['payment_date'], 'member_id' => $monthlyDonation->member_id,
                'is_anonymous' => false, 'payment_method' => $validated['payment_method'],
                'reference_no' => $validated['reference_no'] ?? null,
                'description' => $validated['notes'] ?? sprintf('Monthly donation for %02d/%d.', $monthlyDonation->month, $monthlyDonation->year),
            ], $request->user());

            $paymentStatus = (float) $validated['amount'] >= (float) $monthlyDonation->expected_amount ? 'paid' : 'partial';

            $monthlyDonation->update([
                'transaction_id' => $transaction->id, 'paid_amount' => $validated['amount'],
                'payment_date' => $validated['payment_date'], 'payment_method' => $validated['payment_method'],
                'voucher_no' => $transaction->voucher_no, 'status' => $paymentStatus, 'notes' => $validated['notes'] ?? $monthlyDonation->notes,
            ]);

            AuditLog::create([
                'user_id' => $request->user()->id, 'action' => 'reconciled', 'module' => 'monthly_donations',
                'record_type' => MonthlyDonation::class, 'record_id' => (string) $monthlyDonation->id,
                'details' => 'Monthly commitment linked to a central ledger transaction.',
                'new_values' => $monthlyDonation->fresh()->toArray(), 'ip_address' => $request->ip(),
            ]);

            return $transaction;
        });

        return back()->with('success', sprintf('Monthly donation recorded as %s.', $transaction->voucher_no));
    }
}
