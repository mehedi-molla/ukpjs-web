<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    public function cancel(User $user, Transaction $transaction): bool
    {
        return $user->isSuperAdmin() && $transaction->status === 'completed';
    }

    public function view(User $user, Transaction $transaction): bool
    {
        return $user->isSuperAdmin() || ($user->role === 'member' && $user->member_id !== null && $user->member_id === $transaction->member_id);
    }
}
