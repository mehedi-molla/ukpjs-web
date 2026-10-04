<?php

namespace Tests\Feature;

use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicHomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_home_is_inertia_and_excludes_demo_money_from_totals(): void
    {
        Transaction::create(['voucher_no' => 'UKPJS-TEST-DEMO', 'type' => 'income', 'fund_type' => 'general_hadiya', 'amount' => 9000, 'occurred_at' => now(), 'status' => 'completed', 'is_demo' => true]);
        Transaction::create(['voucher_no' => 'UKPJS-TEST-VALID', 'type' => 'income', 'fund_type' => 'general_hadiya', 'amount' => 1500, 'occurred_at' => now(), 'status' => 'completed', 'is_demo' => false]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Public/Home')
                ->where('financials.totalIncome', 1500)
                ->where('financials.currentBalance', 1500));
    }
}
