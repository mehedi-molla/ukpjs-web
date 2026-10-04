<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\AuditLog;
use App\Models\Project;
use App\Models\Transaction;
use App\Models\WelfareRequest;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $valid = Transaction::query()->where('status', 'completed')->where('is_demo', false);
        $income = (float) (clone $valid)->where('type', 'income')->sum('amount');
        $expense = (float) (clone $valid)->where('type', 'expense')->sum('amount');

        return Inertia::render('Admin/Dashboard', [
            'financials' => [
                'totalIncome' => $income, 'totalExpense' => $expense, 'currentBalance' => $income - $expense,
                'totalGeneralHadiya' => $this->fundTotal($valid, 'general_hadiya'),
                'totalMonthlyDonation' => $this->fundTotal($valid, 'monthly_donation'),
                'totalProjectDonation' => $this->fundTotal($valid, 'project_donation'),
                'totalZakat' => $this->fundTotal($valid, 'zakat'), 'totalSadaqah' => $this->fundTotal($valid, 'sadaqah'),
                'thisMonthIncome' => $this->periodTotal($valid, 'income'), 'thisMonthExpense' => $this->periodTotal($valid, 'expense'),
                'lastMonthIncome' => 0, 'lastMonthExpense' => 0,
            ],
            'projects' => ProjectResource::collection(Project::query()->with('media')->latest()->limit(6)->withSum('validIncomeTransactions as collected_amount', 'amount')->get())->resolve(),
            'welfareRequests' => WelfareRequest::query()->latest()->limit(6)->get()->map(fn (WelfareRequest $request): array => [
                'id' => (string) $request->id, 'status' => $request->status, 'applicantName' => $request->applicant_name,
            ])->values(),
            'logs' => AuditLog::query()->with('user')->latest()->limit(10)->get()->map(fn (AuditLog $log): array => [
                'id' => (string) $log->id, 'action' => $log->action, 'entityType' => $log->record_type,
                'entityId' => (string) $log->record_id, 'userEmail' => $log->user?->email, 'timestamp' => $log->created_at?->toIso8601String(),
            ])->values(),
        ]);
    }

    private function fundTotal($query, string $fund): float
    {
        return (float) (clone $query)->where('type', 'income')->where('fund_type', $fund)->sum('amount');
    }

    private function periodTotal($query, string $type): float
    {
        return (float) (clone $query)->where('type', $type)->whereBetween('occurred_at', [now()->startOfMonth(), now()->endOfMonth()])->sum('amount');
    }
}
