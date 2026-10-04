<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReportFilterRequest;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(ReportFilterRequest $request): Response
    {
        $filters = $request->validated();
        $query = Transaction::query()->where('status', 'completed')->where('is_demo', false);
        $this->applyFilters($query, $filters);
        $income = (float) (clone $query)->where('type', 'income')->sum('amount');
        $expense = (float) (clone $query)->where('type', 'expense')->sum('amount');
        $byFund = (clone $query)->where('type', 'income')->selectRaw('fund_type, SUM(amount) AS total')->groupBy('fund_type')->pluck('total', 'fund_type')->map(fn ($value): float => (float) $value);

        return Inertia::render('Admin/Reports', [
            'filters' => $filters, 'summary' => ['income' => $income, 'expense' => $expense, 'balance' => $income - $expense, 'byFund' => $byFund],
            'transactions' => (clone $query)->with('project:id,title_bn,title_en')->latest('occurred_at')->paginate(50)->withQueryString()->through(fn (Transaction $transaction): array => [
                'id' => $transaction->id, 'voucherNo' => $transaction->voucher_no, 'type' => $transaction->type, 'fundType' => $transaction->fund_type,
                'amount' => (float) $transaction->amount, 'date' => $transaction->occurred_at?->toDateString(), 'projectName' => $transaction->project?->title_en ?? $transaction->project?->title_bn,
            ]),
        ]);
    }

    private function applyFilters(Builder $query, array $filters): void
    {
        $query->when($filters['date_from'] ?? null, fn (Builder $builder, string $date) => $builder->whereDate('occurred_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn (Builder $builder, string $date) => $builder->whereDate('occurred_at', '<=', $date))
            ->when($filters['type'] ?? null, fn (Builder $builder, string $type) => $builder->where('type', $type))
            ->when($filters['fund_type'] ?? null, fn (Builder $builder, string $fund) => $builder->where('fund_type', $fund));
    }
}
