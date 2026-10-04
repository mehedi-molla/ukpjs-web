<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\WelfareRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_donation_confirmation_is_pending_and_does_not_create_ledger_income(): void
    {
        $response = $this->post(route('donation-notifications.store'), [
            'donor_name' => 'Test Donor',
            'phone' => '01700000000',
            'amount' => '1500.00',
            'fund_type' => 'general_hadiya',
            'payment_method' => 'bkash',
            'reference_no' => 'TRX-123',
            'is_anonymous' => false,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('donation_submissions', [
            'donor_name' => 'Test Donor',
            'amount' => 1500,
            'status' => 'pending',
        ]);
        $this->assertSame(0, Transaction::query()->count());
    }

    public function test_anonymous_donation_confirmation_does_not_store_the_donor_name(): void
    {
        $this->post(route('donation-notifications.store'), [
            'donor_name' => 'Private Donor',
            'amount' => 250,
            'fund_type' => 'sadaqah',
            'payment_method' => 'nagad',
            'is_anonymous' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('donation_submissions', [
            'donor_name' => null,
            'amount' => 250,
            'is_anonymous' => true,
        ]);
    }

    public function test_welfare_application_is_stored_as_private_submitted_request(): void
    {
        $response = $this->post(route('welfare.store'), [
            'applicant_name' => 'Test Applicant',
            'guardian_name' => 'Test Guardian',
            'phone' => '01700000000',
            'village' => 'Umarkhali',
            'category' => 'medical',
            'requested_amount' => 5000,
            'description' => 'Private assistance request for testing.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('welfare_requests', [
            'applicant_name' => 'Test Applicant',
            'assistance_type' => 'medical',
            'status' => 'submitted',
        ]);
        $this->assertNotNull(WelfareRequest::query()->first()?->tracking_no);
    }

    public function test_public_submissions_are_validated(): void
    {
        $this->from(route('donate'))->post(route('donation-notifications.store'), [
            'amount' => 0,
            'fund_type' => 'invalid',
            'payment_method' => 'invalid',
        ])->assertRedirect(route('donate'))->assertSessionHasErrors([
            'amount', 'fund_type', 'payment_method',
        ]);

        $this->from(route('welfare.apply'))->post(route('welfare.store'), [
            'applicant_name' => '',
        ])->assertRedirect(route('welfare.apply'))->assertSessionHasErrors([
            'applicant_name', 'phone', 'village', 'category', 'description',
        ]);
    }

    public function test_blood_donor_registration_is_pending_and_not_public_until_verified(): void
    {
        $this->post(route('blood-donors.store'), [
            'name' => 'Test Donor', 'blood_group' => 'O+', 'phone' => '01700000000', 'area' => 'Umarkhali',
        ])->assertRedirect();

        $this->assertDatabaseHas('blood_donors', [
            'name_en' => 'Test Donor', 'blood_group' => 'O+', 'is_public' => false, 'is_verified' => false,
        ]);
        $this->get(route('blood-donors'))->assertInertia(fn ($page) => $page->where('bloodDonors', fn ($rows) => count($rows) === 0));
    }
}
