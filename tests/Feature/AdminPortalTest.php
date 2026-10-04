<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\ContactMessage;
use App\Models\DonationSubmission;
use App\Models\Member;
use App\Models\MonthlyDonation;
use App\Models\Notice;
use App\Models\Project;
use App\Models\Transaction;
use App\Models\User;
use App\Models\WelfareRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_open_real_dashboard_and_ledger_pages(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $this->actingAs($admin)->get(route('admin.dashboard'))
            ->assertOk()->assertInertia(fn ($page) => $page->component('Admin/Dashboard'));
        $this->actingAs($admin)->get(route('admin.transactions.index'))
            ->assertOk()->assertInertia(fn ($page) => $page->component('Admin/Ledger'));
        $this->actingAs($admin)->get(route('admin.projects.index'))
            ->assertOk()->assertInertia(fn ($page) => $page->component('Admin/ProjectManagement'));
        $this->actingAs($admin)->get(route('admin.contacts.index'))
            ->assertOk()->assertInertia(fn ($page) => $page->component('Admin/ContactManagement'));
        $this->actingAs($admin)->get(route('admin.members.index'))
            ->assertOk()->assertInertia(fn ($page) => $page->component('Admin/MemberManagement'));
        $this->actingAs($admin)->post(route('admin.members.store'), [
            'member_no' => 'MEM-NEW', 'name_bn' => 'New Member', 'name_en' => 'New Member', 'member_type' => 'general',
            'is_active' => true, 'is_public_profile' => false,
        ])->assertRedirect();
        $this->assertDatabaseHas('members', ['member_no' => 'MEM-NEW']);
    }

    public function test_admin_ledger_filters_are_validated_and_applied_server_side(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        Transaction::create(['voucher_no' => 'UKPJS-FILTER-IN', 'type' => 'income', 'fund_type' => 'zakat', 'category_name' => 'Medical', 'amount' => 900, 'occurred_at' => '2026-09-01', 'status' => 'completed', 'is_demo' => false]);
        Transaction::create(['voucher_no' => 'UKPJS-FILTER-OUT', 'type' => 'expense', 'fund_type' => 'zakat', 'category_name' => 'Medical', 'amount' => 300, 'occurred_at' => '2026-09-02', 'status' => 'completed', 'is_demo' => false]);

        $this->actingAs($admin)->get(route('admin.transactions.index', ['type' => 'income', 'fund_type' => 'zakat', 'search' => 'FILTER-IN']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('filters.type', 'income')
                ->where('transactions.data', fn ($rows): bool => count($rows) === 1 && $rows[0]['voucherNo'] === 'UKPJS-FILTER-IN'));

        $this->actingAs($admin)->get(route('admin.transactions.index', ['date_from' => 'not-a-date']))->assertStatus(302)->assertSessionHasErrors('date_from');
    }

    public function test_admin_project_filters_are_applied_server_side(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        Project::create(['code' => 'UKPJS-FILTER-P1', 'slug' => 'filter-project-one', 'title_bn' => 'ফিল্টার', 'title_en' => 'Filter project one', 'category' => 'mosque', 'estimated_budget' => 1000, 'status' => 'running', 'is_published' => true]);
        Project::create(['code' => 'UKPJS-FILTER-P2', 'slug' => 'filter-project-two', 'title_bn' => 'অন্য', 'title_en' => 'Other project', 'category' => 'tree', 'estimated_budget' => 1000, 'status' => 'completed', 'is_published' => true]);

        $this->actingAs($admin)->get(route('admin.projects.index', ['status' => 'running', 'search' => 'FILTER-P1']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('filters.status', 'running')->where('projects.data', fn ($rows): bool => count($rows) === 1 && $rows[0]['code'] === 'UKPJS-FILTER-P1'));
    }

    public function test_admin_contact_and_member_filters_are_applied_server_side(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $category = ContactCategory::create(['slug' => 'doctor', 'name_bn' => 'ডাক্তার', 'name_en' => 'Doctor', 'is_active' => true]);
        Contact::create(['category_id' => $category->id, 'name_bn' => 'Verified Doctor', 'name_en' => 'Verified Doctor', 'phone' => '01800000000', 'is_verified' => true, 'is_published' => true]);
        Contact::create(['category_id' => $category->id, 'name_bn' => 'Archived Doctor', 'name_en' => 'Archived Doctor', 'is_verified' => true, 'is_published' => false]);
        Member::create(['member_no' => 'UKPJS-M-FILTER-1', 'name_bn' => 'Probashi One', 'name_en' => 'Probashi One', 'member_type' => 'probashi', 'country' => 'Bangladesh', 'is_active' => true]);
        Member::create(['member_no' => 'UKPJS-M-FILTER-2', 'name_bn' => 'General Two', 'name_en' => 'General Two', 'member_type' => 'general', 'country' => 'Bangladesh', 'is_active' => false]);

        $this->actingAs($admin)->get(route('admin.contacts.index', ['is_published' => '1', 'search' => 'Verified Doctor']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('filters.is_published', true)->where('contacts.data', fn ($rows): bool => count($rows) === 1 && $rows[0]['nameEn'] === 'Verified Doctor'));

        $this->actingAs($admin)->get(route('admin.members.index', ['member_type' => 'probashi', 'is_active' => '1']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('filters.member_type', 'probashi')->where('members.data', fn ($rows): bool => count($rows) === 1 && $rows[0]['memberNo'] === 'UKPJS-M-FILTER-1'));

        $this->actingAs($admin)->get(route('admin.members.index', ['member_type' => 'unknown']))->assertStatus(302)->assertSessionHasErrors('member_type');
    }

    public function test_admin_review_queues_support_validated_server_side_filters(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $member = Member::create(['member_no' => 'UKPJS-QUEUE-MEMBER', 'name_bn' => 'Queue Member', 'name_en' => 'Queue Member', 'member_type' => 'general', 'is_active' => true]);
        MonthlyDonation::create(['member_id' => $member->id, 'month' => 1, 'year' => 2026, 'expected_amount' => 500, 'paid_amount' => 0, 'status' => 'pending']);
        MonthlyDonation::create(['member_id' => $member->id, 'month' => 2, 'year' => 2026, 'expected_amount' => 500, 'paid_amount' => 500, 'status' => 'paid']);
        ContactMessage::create(['name' => 'Queue Sender', 'phone' => '01900000000', 'message' => 'Please call me', 'status' => 'pending']);
        DonationSubmission::create(['donor_name' => 'Queue Donor', 'amount' => 700, 'fund_type' => 'sadaqah', 'payment_method' => 'cash', 'status' => 'pending']);
        WelfareRequest::create(['tracking_no' => 'UKPJS-QUEUE-W1', 'applicant_name' => 'Queue Applicant', 'phone' => '01600000000', 'village' => 'Kistupur', 'assistance_type' => 'Medical', 'description' => 'Private request', 'requested_amount' => 1000, 'status' => 'submitted']);
        Notice::create(['title_bn' => 'Queue notice', 'content_bn' => 'Searchable notice', 'publish_date' => '2026-09-01', 'is_active' => true, 'created_by' => $admin->id]);

        $this->actingAs($admin)->get(route('admin.monthly-donations.index', ['year' => 2026, 'status' => 'pending']))
            ->assertOk()->assertInertia(fn ($page) => $page->where('filters.year', 2026)->where('donations.data', fn ($rows): bool => count($rows) === 1 && $rows[0]['status'] === 'pending'));
        $this->actingAs($admin)->get(route('admin.contact-messages.index', ['status' => 'pending', 'search' => 'Queue Sender']))
            ->assertOk()->assertInertia(fn ($page) => $page->where('messages.data', fn ($rows): bool => count($rows) === 1 && $rows[0]['name'] === 'Queue Sender'));
        $this->actingAs($admin)->get(route('admin.donation-submissions.index', ['fund_type' => 'sadaqah']))
            ->assertOk()->assertInertia(fn ($page) => $page->where('submissions.data', fn ($rows): bool => count($rows) === 1 && $rows[0]['fundType'] === 'sadaqah'));
        $this->actingAs($admin)->get(route('admin.welfare.index', ['status' => 'submitted']))
            ->assertOk()->assertInertia(fn ($page) => $page->where('requests.data', fn ($rows): bool => count($rows) === 1 && $rows[0]['trackingNo'] === 'UKPJS-QUEUE-W1'));
        $this->actingAs($admin)->get(route('admin.notices.index', ['status' => 'active', 'search' => 'Queue notice']))
            ->assertOk()->assertInertia(fn ($page) => $page->where('notices.data', fn ($rows): bool => count($rows) === 1 && $rows[0]['titleBn'] === 'Queue notice'));
        $this->actingAs($admin)->get(route('admin.welfare.index', ['status' => 'invalid']))->assertStatus(302)->assertSessionHasErrors('status');
    }

    public function test_member_cannot_open_admin_pages(): void
    {
        $member = User::factory()->create(['role' => 'member']);

        $this->actingAs($member)->get(route('admin.dashboard'))->assertForbidden();
        $this->actingAs($member)->get(route('admin.transactions.index'))->assertForbidden();
        $this->actingAs($member)->get(route('admin.projects.index'))->assertForbidden();
    }

    public function test_demo_contact_phone_is_not_exposed_publicly(): void
    {
        $category = ContactCategory::create(['slug' => 'ambulance', 'name_bn' => 'অ্যাম্বুলেন্স', 'name_en' => 'Ambulance', 'is_active' => true]);
        Contact::create(['category_id' => $category->id, 'name_bn' => 'Demo contact', 'name_en' => 'Demo contact', 'phone' => '01700000000', 'is_emergency' => true, 'is_verified' => true, 'is_published' => true, 'is_demo' => true]);

        $this->get(route('home'))->assertInertia(fn ($page) => $page
            ->where('contacts.0.phone', '')
            ->where('contacts.0.isVerified', false)
            ->where('contacts.0.isDemoPlaceholder', true));
    }

    public function test_super_admin_can_manage_content_review_queues(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $this->actingAs($admin)->get(route('admin.notices.index'))->assertOk()->assertInertia(fn ($page) => $page->component('Admin/NoticeManagement'));
        $this->actingAs($admin)->get(route('admin.settings.edit'))->assertOk()->assertInertia(fn ($page) => $page->component('Admin/Settings'));
        $this->actingAs($admin)->get(route('admin.welfare.index'))->assertOk()->assertInertia(fn ($page) => $page->component('Admin/Welfare'));
        $this->actingAs($admin)->get(route('admin.donation-submissions.index'))->assertOk()->assertInertia(fn ($page) => $page->component('Admin/DonationSubmissions'));
        $this->actingAs($admin)->get(route('admin.monthly-donations.index'))->assertOk()->assertInertia(fn ($page) => $page->component('Admin/MonthlyDonationManagement'));
        $this->actingAs($admin)->get(route('admin.reports.index'))->assertOk()->assertInertia(fn ($page) => $page->component('Admin/Reports'));
        $this->actingAs($admin)->put(route('admin.settings.update'), ['org_name_bn' => 'সংঘ', 'org_name_en' => 'Songho', 'currency_symbol' => 'BDT'])->assertRedirect();
        $this->assertDatabaseHas('audit_logs', ['module' => 'settings', 'action' => 'updated', 'user_id' => $admin->id]);
    }

    public function test_admin_archives_directory_records_without_deleting_history(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $member = Member::create(['member_no' => 'MEM-ARCHIVE', 'name_bn' => 'Archive Member', 'is_active' => true, 'is_public_profile' => true]);
        $project = Project::create(['code' => 'ARCHIVE-001', 'slug' => 'archive-project', 'title_bn' => 'প্রকল্প', 'title_en' => 'Project', 'category' => 'welfare', 'estimated_budget' => 1000, 'status' => 'upcoming', 'is_published' => true]);
        $category = ContactCategory::create(['slug' => 'archive-category', 'name_bn' => 'বিভাগ', 'name_en' => 'Category', 'is_active' => true]);
        $contact = Contact::create(['category_id' => $category->id, 'name_bn' => 'Contact', 'name_en' => 'Contact', 'is_published' => true]);
        $notice = Notice::create(['title_bn' => 'ঘোষণা', 'title_en' => 'Notice', 'content_bn' => 'Content', 'is_active' => true, 'created_by' => $admin->id]);

        $this->actingAs($admin)->patch(route('admin.members.archive', $member))->assertRedirect();
        $this->actingAs($admin)->patch(route('admin.projects.archive', $project))->assertRedirect();
        $this->actingAs($admin)->patch(route('admin.contacts.archive', $contact))->assertRedirect();
        $this->actingAs($admin)->patch(route('admin.notices.archive', $notice))->assertRedirect();

        $this->assertDatabaseHas('members', ['id' => $member->id, 'is_active' => false, 'is_public_profile' => false]);
        $this->assertDatabaseHas('projects', ['id' => $project->id, 'is_published' => false]);
        $this->assertDatabaseHas('contacts', ['id' => $contact->id, 'is_published' => false]);
        $this->assertDatabaseHas('notices', ['id' => $notice->id, 'is_active' => false]);
        $this->assertSame(4, AuditLog::query()->where('action', 'archived')->count());
    }

    public function test_approved_donation_submission_enters_ledger_once(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $submission = DonationSubmission::create(['donor_name' => 'Donor', 'amount' => 1200, 'fund_type' => 'sadaqah', 'payment_method' => 'bkash', 'status' => 'pending']);

        $this->actingAs($admin)->patch(route('admin.donation-submissions.review', $submission), ['status' => 'approved'])->assertRedirect();
        $this->assertDatabaseHas('transactions', ['amount' => 1200, 'type' => 'income', 'status' => 'completed', 'is_demo' => false]);
        $this->assertSame(1, Transaction::query()->count());

        $this->actingAs($admin)->patch(route('admin.donation-submissions.review', $submission), ['status' => 'approved'])->assertStatus(422);
        $this->assertSame(1, Transaction::query()->count());
    }

    public function test_admin_can_create_a_monthly_commitment_without_creating_ledger_income(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $member = Member::create(['member_no' => 'MEM-MONTH', 'name_bn' => 'Monthly Member', 'is_active' => true]);

        $this->actingAs($admin)->post(route('admin.monthly-donations.store'), [
            'member_id' => $member->id, 'month' => 9, 'year' => 2026, 'expected_amount' => '500.00',
        ])->assertRedirect();

        $this->assertDatabaseHas('monthly_donations', ['member_id' => $member->id, 'month' => 9, 'year' => 2026, 'expected_amount' => 500, 'paid_amount' => 0, 'status' => 'pending']);
        $this->assertDatabaseCount('transactions', 0);
    }

    public function test_monthly_payment_reconciliation_creates_one_linked_ledger_entry_and_cancellation_reopens_commitment(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $member = Member::create(['member_no' => 'MEM-RECON', 'name_bn' => 'Reconciliation Member', 'is_active' => true]);
        $monthlyDonation = MonthlyDonation::create(['member_id' => $member->id, 'month' => 9, 'year' => 2026, 'expected_amount' => 500, 'paid_amount' => 0, 'status' => 'pending']);

        $this->actingAs($admin)->post(route('admin.monthly-donations.mark-paid', $monthlyDonation), [
            'amount' => '500.00', 'payment_date' => '2026-09-26', 'payment_method' => 'cash', 'reference_no' => 'CASH-RECON',
        ])->assertRedirect();

        $monthlyDonation->refresh();
        $this->assertNotNull($monthlyDonation->transaction_id);
        $this->assertSame('paid', $monthlyDonation->status);
        $this->assertDatabaseCount('transactions', 1);
        $this->assertDatabaseHas('transactions', ['id' => $monthlyDonation->transaction_id, 'fund_type' => 'monthly_donation', 'member_id' => $member->id]);

        $this->actingAs($admin)->post(route('admin.monthly-donations.mark-paid', $monthlyDonation), [
            'amount' => '500.00', 'payment_date' => '2026-09-26', 'payment_method' => 'cash',
        ])->assertStatus(422);
        $this->assertDatabaseCount('transactions', 1);

        $this->actingAs($admin)->patch(route('admin.transactions.cancel', $monthlyDonation->transaction_id), ['reason' => 'Correction required'])->assertRedirect();
        $this->assertDatabaseHas('monthly_donations', ['id' => $monthlyDonation->id, 'transaction_id' => null, 'paid_amount' => 0, 'status' => 'pending']);
    }

    public function test_welfare_disbursement_creates_audited_expense(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $request = WelfareRequest::create([
            'tracking_no' => 'UKPJS-WEL-TEST', 'applicant_name' => 'Applicant', 'phone' => '01700000000', 'village' => 'Umarkhali',
            'assistance_type' => 'medical', 'description' => 'Test request', 'requested_amount' => 3000, 'status' => 'submitted',
        ]);

        $this->actingAs($admin)->patch(route('admin.welfare.update', $request), [
            'status' => 'disbursed', 'approved_amount' => 2500, 'fund_type' => 'zakat',
        ])->assertRedirect();
        $this->assertDatabaseHas('transactions', ['type' => 'expense', 'amount' => 2500, 'fund_type' => 'zakat', 'is_demo' => false]);
        $this->assertDatabaseHas('welfare_requests', ['id' => $request->id, 'status' => 'disbursed']);
    }

    public function test_receipt_access_is_limited_to_admin_or_own_member_transaction(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $member = Member::create(['member_no' => 'MEM-REC', 'name_bn' => 'Receipt Member', 'is_active' => true]);
        $otherMember = Member::create(['member_no' => 'MEM-OTHER', 'name_bn' => 'Other Member', 'is_active' => true]);
        $memberUser = User::factory()->create(['role' => 'member', 'member_id' => $member->id]);
        $transaction = Transaction::create(['voucher_no' => 'UKPJS-REC-001', 'type' => 'income', 'fund_type' => 'monthly_donation', 'amount' => 1000, 'occurred_at' => now(), 'member_id' => $member->id, 'status' => 'completed', 'is_demo' => false]);
        $otherTransaction = Transaction::create(['voucher_no' => 'UKPJS-REC-002', 'type' => 'income', 'fund_type' => 'monthly_donation', 'amount' => 1000, 'occurred_at' => now(), 'member_id' => $otherMember->id, 'status' => 'completed', 'is_demo' => false]);

        $this->actingAs($admin)->get(route('transactions.receipt', $transaction))->assertOk()->assertInertia(fn ($page) => $page->component('Receipt'));
        $this->actingAs($memberUser)->get(route('transactions.receipt', $transaction))->assertOk();
        $this->actingAs($memberUser)->get(route('transactions.receipt', $otherTransaction))->assertForbidden();
    }
}
