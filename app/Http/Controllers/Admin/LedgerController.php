<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Ledger\CancelTransactionAction;
use App\Actions\Ledger\CreateTransactionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CancelTransactionRequest;
use App\Http\Requests\Admin\LedgerFilterRequest;
use App\Http\Requests\Admin\StoreTransactionRequest;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LedgerController extends Controller
{
    public function index(LedgerFilterRequest $request): Response
    {
        $filters = $request->validated();
        $query = Transaction::query()->with(['project:id,title_bn,title_en', 'member:id,name_bn,name_en', 'media']);
        $query->when($filters['search'] ?? null, function ($query, string $search): void {
            $query->where(function ($query) use ($search): void {
                $query->where('voucher_no', 'like', "%{$search}%")
                    ->orWhere('category_name', 'like', "%{$search}%")
                    ->orWhere('donor_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('member', fn ($memberQuery) => $memberQuery->where('name_bn', 'like', "%{$search}%")->orWhere('name_en', 'like', "%{$search}%"))
                    ->orWhereHas('project', fn ($projectQuery) => $projectQuery->where('title_bn', 'like', "%{$search}%")->orWhere('title_en', 'like', "%{$search}%"));
            });
        });
        $query->when($filters['type'] ?? null, fn ($query, string $type) => $query->where('type', $type));
        $query->when($filters['fund_type'] ?? null, fn ($query, string $fund) => $query->where('fund_type', $fund));
        $query->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status));
        $query->when($filters['date_from'] ?? null, fn ($query, string $date) => $query->whereDate('occurred_at', '>=', $date));
        $query->when($filters['date_to'] ?? null, fn ($query, string $date) => $query->whereDate('occurred_at', '<=', $date));

        return Inertia::render('Admin/Ledger', [
            'filters' => $filters,
            'transactions' => $query->latest('occurred_at')->paginate(25)->withQueryString()->through(fn (Transaction $transaction): array => [
                'id' => $transaction->id, 'voucherNo' => $transaction->voucher_no, 'type' => $transaction->type,
                'fundType' => $transaction->fund_type, 'amount' => (float) $transaction->amount, 'occurredAt' => $transaction->occurred_at?->toDateString(),
                'status' => $transaction->status, 'donorName' => $transaction->donor_name, 'memberName' => $transaction->member?->name_bn,
                'projectName' => $transaction->project?->title_bn, 'isDemo' => $transaction->is_demo,
                'attachmentUrl' => $transaction->getFirstMediaUrl('receipt') ?: $transaction->attachment_path,
            ]),
        ]);
    }

    public function store(StoreTransactionRequest $request, CreateTransactionAction $action): RedirectResponse
    {
        $data = $request->validated();
        $attachment = $data['attachment_file'] ?? null;
        unset($data['attachment_file']);
        $transaction = $action->handle($data, $request->user());
        if ($request->hasFile('attachment_file')) {
            $transaction->addMedia($attachment)->toMediaCollection('receipt');
        }

        return back()->with('success', 'Transaction recorded successfully.');
    }

    public function cancel(CancelTransactionRequest $request, Transaction $transaction, CancelTransactionAction $action): RedirectResponse
    {
        $this->authorize('cancel', $transaction);
        $action->handle($transaction, $request->validated()['reason'], $request->user());

        return back()->with('success', 'Transaction cancelled and retained in the audit history.');
    }
}
