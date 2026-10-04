<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Inertia\Inertia;
use Inertia\Response;

class ReceiptController extends Controller
{
    public function show(Transaction $transaction): Response
    {
        $this->authorize('view', $transaction);
        abort_unless($transaction->status === 'completed', 404);
        $transaction->load(['project:id,title_bn,title_en', 'member:id,name_bn,name_en']);

        return Inertia::render('Receipt', ['transaction' => [
            'voucherNo' => $transaction->voucher_no, 'type' => $transaction->type, 'fundType' => $transaction->fund_type,
            'amount' => (float) $transaction->amount, 'date' => $transaction->occurred_at?->toDateString(),
            'donorName' => $transaction->is_anonymous ? 'Anonymous' : ($transaction->donor_name ?? $transaction->member?->name_en ?? $transaction->member?->name_bn),
            'projectName' => $transaction->project?->title_en ?? $transaction->project?->title_bn, 'paymentMethod' => $transaction->payment_method,
            'referenceNo' => $transaction->reference_no, 'description' => $transaction->description,
        ]]);
    }
}
