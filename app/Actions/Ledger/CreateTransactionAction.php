<?php

namespace App\Actions\Ledger;

use App\Models\AuditLog;
use App\Models\LedgerSequence;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateTransactionAction
{
    public function handle(array $data, User $actor): Transaction
    {
        return DB::transaction(function () use ($data, $actor): Transaction {
            $year = (int) date('Y', strtotime($data['occurred_at']));
            $sequence = LedgerSequence::query()->where('year', $year)->lockForUpdate()->first();

            if (! $sequence) {
                $sequence = LedgerSequence::create(['year' => $year, 'last_sequence' => 0]);
            }

            $sequence->increment('last_sequence');

            $transaction = Transaction::create([
                ...$data,
                'voucher_no' => sprintf('UKPJS-%d-%06d', $year, $sequence->fresh()->last_sequence),
                'created_by' => $actor->id,
                'status' => 'completed',
                'is_demo' => false,
            ]);

            AuditLog::create([
                'user_id' => $actor->id, 'action' => 'created', 'module' => 'ledger', 'record_type' => Transaction::class,
                'record_id' => (string) $transaction->id, 'details' => 'Ledger transaction created.', 'new_values' => $transaction->toArray(),
                'ip_address' => request()->ip(),
            ]);

            return $transaction;
        });
    }
}
