<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function member(Request $request): Response
    {
        $member = $request->user()->member;
        $validLedger = Transaction::query()->where('status', 'completed')->where('is_demo', false);
        $memberLedger = $member
            ? Transaction::query()->whereBelongsTo($member)->where('type', 'income')->where('status', 'completed')->where('is_demo', false)
            : Transaction::query()->whereRaw('1 = 0');
        $memberIncome = (float) (clone $memberLedger)->sum('amount');
        $memberProjectIncome = (float) (clone $memberLedger)
            ->where(fn ($query) => $query->where('fund_type', 'project_donation')->orWhereNotNull('project_id'))
            ->sum('amount');
        $memberTransactions = (clone $memberLedger)->with('project:id,title_bn,title_en')
            ->latest('occurred_at')->latest('id')->paginate(20)->withQueryString();
        $organizationIncome = (float) (clone $validLedger)->where('type', 'income')->sum('amount');
        $organizationExpense = (float) (clone $validLedger)->where('type', 'expense')->sum('amount');
        $currentMonth = now()->startOfMonth();
        $hasPaidThisMonth = $member && (clone $memberLedger)->where('fund_type', 'monthly_donation')
            ->whereBetween('occurred_at', [$currentMonth, $currentMonth->copy()->endOfMonth()])->exists();

        return Inertia::render('Portal/Dashboard', [
            'role' => 'member',
            'member' => $member ? [
                'memberNo' => $member->member_no, 'nameBn' => $member->name_bn, 'nameEn' => $member->name_en,
                'country' => $member->country, 'village' => $member->village, 'monthlyPledgeAmount' => (float) $member->monthly_pledge_amount,
            ] : null,
            'summary' => [
                'myTotal' => $memberIncome, 'myProjectTotal' => $memberProjectIncome, 'organizationBalance' => $organizationIncome - $organizationExpense,
                'hasPaidThisMonth' => $hasPaidThisMonth,
            ],
            'contributions' => $memberTransactions->through(fn (Transaction $transaction): array => [
                'id' => $transaction->id, 'voucherNo' => $transaction->voucher_no, 'amount' => (float) $transaction->amount,
                'date' => $transaction->occurred_at?->toDateString() ?? '', 'fundType' => $transaction->fund_type,
                'projectName' => $transaction->project?->title_en ?? $transaction->project?->title_bn,
            ]),
        ]);
    }
}
