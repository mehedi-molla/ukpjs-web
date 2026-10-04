<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Ledger\CancelTransactionAction;
use App\Actions\Ledger\CreateTransactionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CancelTransactionRequest;
use App\Http\Requests\Admin\StoreTransactionRequest;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;

class TransactionController extends Controller
{
    public function store(StoreTransactionRequest $request, CreateTransactionAction $create): RedirectResponse
    {
        $this->authorize('create', Transaction::class);
        $create->handle($request->validated(), $request->user());

        return back()->with('success', 'Transaction recorded successfully.');
    }

    public function cancel(CancelTransactionRequest $request, Transaction $transaction, CancelTransactionAction $cancel): RedirectResponse
    {
        $this->authorize('cancel', $transaction);
        $cancel->handle($transaction, $request->validated('reason'), $request->user());

        return back()->with('success', 'Transaction cancelled with an audit record.');
    }
}
