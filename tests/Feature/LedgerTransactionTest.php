<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LedgerTransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_record_a_decimal_transaction_with_a_yearly_voucher(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $this->actingAs($admin)->post(route('admin.transactions.store'), [
            'type' => 'income', 'fund_type' => 'general_hadiya', 'amount' => '1250.50', 'occurred_at' => '2026-09-26',
            'payment_method' => 'bkash', 'description' => 'Verified contribution',
        ])->assertRedirect();

        $this->assertDatabaseHas('transactions', [
            'voucher_no' => 'UKPJS-2026-000001', 'amount' => 1250.50, 'status' => 'completed', 'is_demo' => false,
        ]);
        $this->assertDatabaseHas('audit_logs', ['module' => 'ledger', 'action' => 'created']);
    }

    public function test_member_cannot_record_or_cancel_ledger_entries(): void
    {
        $member = User::factory()->create(['role' => 'member']);
        $transaction = Transaction::create([
            'voucher_no' => 'UKPJS-2026-000099', 'type' => 'income', 'fund_type' => 'general_hadiya', 'amount' => 100,
            'occurred_at' => '2026-09-26', 'payment_method' => 'cash', 'status' => 'completed', 'is_demo' => false,
        ]);

        $this->actingAs($member)->post(route('admin.transactions.store'), [
            'type' => 'income', 'fund_type' => 'general_hadiya', 'amount' => 100, 'occurred_at' => '2026-09-26', 'payment_method' => 'cash',
        ])->assertForbidden();

        $this->actingAs($member)->patch(route('admin.transactions.cancel', $transaction), ['reason' => 'Not permitted'])
            ->assertForbidden();
    }

    public function test_cancellation_preserves_the_original_ledger_row(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $transaction = Transaction::create([
            'voucher_no' => 'UKPJS-2026-000100', 'type' => 'expense', 'fund_type' => 'general_hadiya', 'amount' => 100,
            'occurred_at' => '2026-09-26', 'payment_method' => 'cash', 'status' => 'completed', 'is_demo' => false,
        ]);

        $this->actingAs($admin)->patch(route('admin.transactions.cancel', $transaction), ['reason' => 'Duplicate entry'])
            ->assertRedirect();

        $this->assertDatabaseHas('transactions', ['id' => $transaction->id, 'status' => 'cancelled', 'cancellation_reason' => 'Duplicate entry']);
        $this->assertDatabaseHas('audit_logs', ['record_id' => (string) $transaction->id, 'action' => 'cancelled']);
    }
}
