<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationAndIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->create(['email' => 'member@example.test', 'password' => 'correct-password']);

        $this->from(route('login'))
            ->post(route('login.store'), [
                'email_or_member_id' => 'member@example.test',
                'password' => 'wrong-password',
            ])
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('email_or_member_id');
    }

    public function test_super_admin_can_login_and_member_cannot_open_admin_dashboard(): void
    {
        $admin = User::factory()->create(['email' => 'admin@example.test', 'password' => 'correct-password', 'role' => 'super_admin']);
        $member = User::factory()->create(['email' => 'member@example.test', 'password' => 'correct-password', 'role' => 'member']);

        $this->post(route('login.store'), ['email_or_member_id' => $admin->email, 'password' => 'correct-password'])
            ->assertRedirect(route('admin.dashboard'));

        $this->actingAs($member)->get(route('admin.dashboard'))->assertForbidden();
    }

    public function test_member_sees_only_own_verified_contributions(): void
    {
        $member = Member::create(['member_no' => 'MEM-100', 'name_bn' => 'Member', 'is_active' => true]);
        $otherMember = Member::create(['member_no' => 'MEM-101', 'name_bn' => 'Other', 'is_active' => true]);
        $user = User::factory()->create(['role' => 'member', 'member_id' => $member->id]);

        Transaction::create(['voucher_no' => 'UKPJS-TEST-001', 'type' => 'income', 'fund_type' => 'monthly_donation', 'amount' => 1000, 'occurred_at' => now(), 'member_id' => $member->id, 'status' => 'completed', 'is_demo' => false]);
        Transaction::create(['voucher_no' => 'UKPJS-TEST-002', 'type' => 'income', 'fund_type' => 'monthly_donation', 'amount' => 2000, 'occurred_at' => now(), 'member_id' => $otherMember->id, 'status' => 'completed', 'is_demo' => false]);

        $this->actingAs($user)->get(route('member.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Portal/Dashboard')
                ->where('contributions.data', fn ($rows) => count($rows) === 1 && $rows[0]['voucherNo'] === 'UKPJS-TEST-001')
                ->where('contributions.total', 1));
    }

    public function test_member_summary_uses_all_entries_and_history_is_paginated(): void
    {
        $member = Member::create(['member_no' => 'MEM-200', 'name_bn' => 'Member', 'is_active' => true]);
        $user = User::factory()->create(['role' => 'member', 'member_id' => $member->id]);

        foreach (range(1, 25) as $number) {
            Transaction::create([
                'voucher_no' => sprintf('UKPJS-TEST-%03d', $number), 'type' => 'income',
                'fund_type' => $number === 1 ? 'monthly_donation' : 'general_hadiya',
                'amount' => 100, 'occurred_at' => now()->subDays(25 - $number), 'member_id' => $member->id,
                'status' => 'completed', 'is_demo' => false,
            ]);
        }

        $this->actingAs($user)->get(route('member.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Portal/Dashboard')
                ->where('summary.myTotal', 2500)
                ->where('summary.hasPaidThisMonth', true)
                ->where('contributions.total', 25)
                ->where('contributions.per_page', 20)
                ->has('contributions.data', 20));
    }
}
