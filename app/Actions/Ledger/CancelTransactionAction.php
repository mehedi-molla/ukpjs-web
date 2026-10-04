<?php

namespace App\Actions\Ledger;

use App\Models\AuditLog;
use App\Models\MonthlyDonation;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CancelTransactionAction
{
    public function handle(Transaction $transaction, string $reason, User $actor): Transaction
    {
        return DB::transaction(function () use ($transaction, $reason, $actor): Transaction {
            $transaction->update(['status' => 'cancelled', 'cancellation_reason' => $reason]);

            $monthlyDonation = MonthlyDonation::query()->where('transaction_id', $transaction->id)->first();
            if ($monthlyDonation) {
                $monthlyDonation->update([
                    'transaction_id' => null, 'paid_amount' => 0, 'payment_date' => null,
                    'payment_method' => null, 'voucher_no' => null, 'status' => 'pending',
                ]);
            }

            AuditLog::create([
                'user_id' => $actor->id, 'action' => 'cancelled', 'module' => 'ledger', 'record_type' => Transaction::class,
                'record_id' => (string) $transaction->id, 'details' => $reason, 'old_values' => ['status' => 'completed'],
                'new_values' => ['status' => 'cancelled', 'cancellation_reason' => $reason], 'ip_address' => request()->ip(),
            ]);

            return $transaction->refresh();
        });
    }
}
