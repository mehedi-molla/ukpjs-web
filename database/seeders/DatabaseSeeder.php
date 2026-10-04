<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\BloodDonor;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Member;
use App\Models\MonthlyDonation;
use App\Models\Notice;
use App\Models\Project;
use App\Models\Transaction;
use App\Models\User;
use App\Models\WebsiteSetting;
use App\Models\WelfareRequest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $file = base_path('data/db.json');

        if (! is_file($file)) {
            $this->command?->warn('Prototype seed file data/db.json was not found; no UKPJS data was imported.');

            return;
        }

        $data = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
        $adminPassword = env('UKPJS_SEED_ADMIN_PASSWORD');
        $memberPassword = env('UKPJS_SEED_MEMBER_PASSWORD');
        if (app()->environment('production') && (! $adminPassword || ! $memberPassword)) {
            throw new \RuntimeException('Set UKPJS_SEED_ADMIN_PASSWORD and UKPJS_SEED_MEMBER_PASSWORD before seeding production credentials.');
        }
        $adminPassword ??= 'ChangeMe!123';
        $memberPassword ??= 'ChangeMe!123';
        $toDate = static fn (?string $value): ?string => $value ? substr($value, 0, 10) : null;
        $asList = static function (mixed $value): array {
            if (is_array($value)) {
                return array_values(array_filter($value));
            }

            return $value ? [$value] : [];
        };

        DB::transaction(function () use ($data, $toDate, $asList, $adminPassword, $memberPassword): void {
            $members = [];
            foreach ($data['members'] ?? [] as $row) {
                $member = Member::updateOrCreate(
                    ['legacy_id' => $row['id']],
                    [
                        'member_no' => $row['memberId'],
                        'name_bn' => $row['nameBn'],
                        'name_en' => $row['nameEn'] ?? null,
                        'phone' => $row['phone'] ?? null,
                        'whatsapp' => $row['whatsapp'] ?? null,
                        'email' => $row['email'] ?? null,
                        'address_bn' => $row['addressBn'] ?? null,
                        'address_en' => $row['addressEn'] ?? null,
                        'village' => $row['village'] ?? null,
                        'country' => $row['country'] ?? null,
                        'occupation_bn' => $row['occupationBn'] ?? null,
                        'occupation_en' => $row['occupationEn'] ?? null,
                        'member_type' => $row['memberType'] ?? 'general',
                        'monthly_pledge_amount' => $row['monthlyPledgeAmount'] ?? 0,
                        'joining_date' => $toDate($row['joiningDate'] ?? null),
                        'is_active' => $row['isActive'] ?? true,
                        'is_public_profile' => $row['isPublicProfile'] ?? false,
                        'notes' => $row['notes'] ?? null,
                    ],
                );
                $members[$row['id']] = $member;
                $members[$row['memberId']] = $member;
            }

            $admin = User::updateOrCreate(
                ['email' => 'admin@ukpjs.org'],
                [
                    'name' => data_get($data, 'users.0.name', 'UKPJS Super Admin'),
                    'phone' => data_get($data, 'users.0.phone'),
                    'role' => 'super_admin',
                    'member_id' => $members[data_get($data, 'users.0.memberId')]?->id,
                    'password' => $adminPassword,
                    'email_verified_at' => now(),
                ],
            );

            foreach ($data['users'] ?? [] as $row) {
                if (($row['role'] ?? null) === 'super_admin') {
                    continue;
                }

                User::updateOrCreate(
                    ['email' => $row['email']],
                    [
                        'name' => $row['name'],
                        'phone' => $row['phone'] ?? null,
                        'role' => 'member',
                        'member_id' => $members[$row['memberId'] ?? '']?->id,
                        'password' => $memberPassword,
                        'email_verified_at' => now(),
                    ],
                );
            }

            $categories = [];
            foreach ($data['contactCategories'] ?? [] as $row) {
                $category = ContactCategory::updateOrCreate(
                    ['legacy_id' => $row['id']],
                    [
                        'slug' => $row['slug'],
                        'name_bn' => $row['nameBn'],
                        'name_en' => $row['nameEn'] ?? null,
                        'icon' => $row['icon'] ?? null,
                        'sort_order' => $row['sortOrder'] ?? 0,
                        'is_active' => $row['isActive'] ?? true,
                        'is_core' => $row['isCore'] ?? false,
                        'description_bn' => $row['descriptionBn'] ?? null,
                        'description_en' => $row['descriptionEn'] ?? null,
                    ],
                );
                $categories[$row['id']] = $category;
                $categories[$row['slug']] = $category;
            }

            $projects = [];
            foreach ($data['projects'] ?? [] as $row) {
                $project = Project::updateOrCreate(
                    ['legacy_id' => $row['id']],
                    [
                        'code' => $row['code'],
                        'slug' => $row['slug'],
                        'title_bn' => $row['titleBn'],
                        'title_en' => $row['titleEn'] ?? null,
                        'category' => $row['category'] ?? null,
                        'short_desc_bn' => $row['shortDescBn'] ?? null,
                        'short_desc_en' => $row['shortDescEn'] ?? null,
                        'full_desc_bn' => $row['fullDescBn'] ?? null,
                        'full_desc_en' => $row['fullDescEn'] ?? null,
                        'featured_image' => $row['featuredImage'] ?? null,
                        'gallery_images' => $asList($row['galleryImages'] ?? null),
                        'video_url' => $row['videoUrl'] ?? null,
                        'start_date' => $toDate($row['startDate'] ?? null),
                        'estimated_end_date' => $toDate($row['estimatedEndDate'] ?? null),
                        'actual_end_date' => $toDate($row['actualEndDate'] ?? null),
                        'estimated_budget' => $row['estimatedBudget'] ?? 0,
                        'status' => $row['status'] ?? 'upcoming',
                        'location' => $row['location'] ?? null,
                        'responsible_members' => $asList($row['responsibleMembers'] ?? null),
                        'beneficiaries_count' => $row['beneficiariesCount'] ?? null,
                        'beneficiary_info_bn' => $row['beneficiaryInfoBn'] ?? null,
                        'beneficiary_info_en' => $row['beneficiaryInfoEn'] ?? null,
                        'is_published' => $row['isPublished'] ?? false,
                        'is_featured' => $row['isFeatured'] ?? false,
                        'completion_outcome_bn' => $row['completionOutcomeBn'] ?? null,
                        'completion_outcome_en' => $row['completionOutcomeEn'] ?? null,
                        'is_demo' => true,
                    ],
                );
                $projects[$row['id']] = $project;
                $projects[$row['slug']] = $project;
            }

            foreach ($data['contacts'] ?? [] as $row) {
                Contact::updateOrCreate(
                    ['legacy_id' => $row['id']],
                    [
                        'category_id' => $categories[$row['categoryId'] ?? '']?->id,
                        'name_bn' => $row['nameBn'],
                        'name_en' => $row['nameEn'] ?? null,
                        'designation_bn' => $row['designationBn'] ?? null,
                        'designation_en' => $row['designationEn'] ?? null,
                        'union_name' => $row['unionName'] ?? null,
                        'ward' => $row['ward'] ?? null,
                        'area' => $row['area'] ?? null,
                        'phone' => $row['phone'] ?? null,
                        'alt_phone' => $row['altPhone'] ?? null,
                        'whatsapp' => $row['whatsapp'] ?? null,
                        'address_bn' => $row['addressBn'] ?? null,
                        'address_en' => $row['addressEn'] ?? null,
                        'description_bn' => $row['descriptionBn'] ?? null,
                        'description_en' => $row['descriptionEn'] ?? null,
                        'photo_path' => $row['photoUrl'] ?? null,
                        'vehicle_photo_path' => $row['vehiclePhotoUrl'] ?? null,
                        'service_area' => $row['serviceArea'] ?? null,
                        'availability' => $row['availability'] ?? null,
                        'is_emergency' => $row['isEmergency'] ?? false,
                        'is_verified' => $row['isVerified'] ?? false,
                        'last_verified_at' => $toDate($row['lastVerifiedAt'] ?? null),
                        'is_published' => $row['isPublished'] ?? false,
                        'is_featured' => $row['isFeatured'] ?? false,
                        'sort_order' => $row['sortOrder'] ?? 0,
                        'is_demo' => true,
                        'notes' => $row['notes'] ?? null,
                    ],
                );
            }

            foreach ($data['bloodDonors'] ?? [] as $row) {
                BloodDonor::updateOrCreate(
                    ['legacy_id' => $row['id']],
                    [
                        'name_bn' => $row['nameBn'], 'name_en' => $row['nameEn'] ?? null, 'blood_group' => $row['bloodGroup'],
                        'area_bn' => $row['areaBn'] ?? null, 'area_en' => $row['areaEn'] ?? null, 'phone' => $row['phone'] ?? null,
                        'last_donation_date' => $toDate($row['lastDonationDate'] ?? null), 'is_available' => $row['isAvailable'] ?? true,
                        'is_public' => $row['isPublic'] ?? false, 'is_verified' => false, 'is_demo' => true, 'created_by' => $admin->id,
                    ],
                );
            }

            foreach ($data['notices'] ?? [] as $row) {
                Notice::updateOrCreate(
                    ['legacy_id' => $row['id']],
                    [
                        'title_bn' => $row['titleBn'],
                        'title_en' => $row['titleEn'] ?? null,
                        'content_bn' => $row['contentBn'] ?? null,
                        'content_en' => $row['contentEn'] ?? null,
                        'publish_date' => $toDate($row['publishDate'] ?? null),
                        'is_pinned' => $row['isPinned'] ?? false,
                        'is_active' => $row['isActive'] ?? true,
                        'created_by' => $admin->id,
                    ],
                );
            }

            $setting = $data['settings'] ?? [];
            WebsiteSetting::query()->updateOrCreate(['id' => 1], [
                'org_name_bn' => $setting['orgNameBn'], 'org_name_en' => $setting['orgNameEn'],
                'slogan_bn' => $setting['sloganBn'] ?? null, 'slogan_en' => $setting['sloganEn'] ?? null,
                'established_year' => $setting['establishedYear'] ?? null, 'logo_path' => $setting['logoUrl'] ?? null,
                'address_bn' => $setting['addressBn'] ?? null, 'address_en' => $setting['addressEn'] ?? null,
                'contact_phone' => $setting['contactPhone'] ?? null, 'contact_email' => $setting['contactEmail'] ?? null,
                'whatsapp_number' => $setting['whatsappNumber'] ?? null, 'facebook_url' => $setting['facebookUrl'] ?? null,
                'youtube_url' => $setting['youtubeUrl'] ?? null, 'mission_bn' => $setting['missionBn'] ?? null,
                'mission_en' => $setting['missionEn'] ?? null, 'vision_bn' => $setting['visionBn'] ?? null,
                'vision_en' => $setting['visionEn'] ?? null, 'about_history_bn' => $setting['aboutHistoryBn'] ?? null,
                'about_history_en' => $setting['aboutHistoryEn'] ?? null, 'donation_instructions_bn' => $setting['donationInstructionsBn'] ?? null,
                'donation_instructions_en' => $setting['donationInstructionsEn'] ?? null, 'bkash_number' => $setting['bkashNumber'] ?? null,
                'nagad_number' => $setting['nagadNumber'] ?? null, 'rocket_number' => $setting['rocketNumber'] ?? null,
                'bank_account_details' => $setting['bankAccountDetails'] ?? null, 'currency_symbol' => $setting['currencySymbol'] ?? '৳',
                'is_public_transparency_enabled' => $setting['isPublicTransparencyEnabled'] ?? false,
            ]);

            foreach ($data['transactions'] ?? [] as $row) {
                $project = isset($row['projectId']) ? ($projects[$row['projectId']] ?? null) : null;
                $member = isset($row['memberId']) ? ($members[$row['memberId']] ?? null) : null;

                Transaction::updateOrCreate(
                    ['legacy_id' => $row['id']],
                    [
                        'voucher_no' => $row['voucherNo'], 'type' => $row['type'], 'fund_type' => $row['fundType'] ?? 'general_hadiya',
                        'category_id' => $row['categoryId'] ?? null, 'category_name' => $row['categoryName'] ?? null,
                        'amount' => $row['amount'], 'occurred_at' => $toDate($row['date'] ?? null),
                        'project_id' => $project?->id, 'member_id' => $member?->id,
                        'donor_name' => $row['donorName'] ?? null, 'is_anonymous' => $row['isAnonymous'] ?? false,
                        'payment_method' => $row['paymentMethod'] ?? 'cash', 'reference_no' => $row['referenceNo'] ?? null,
                        'description' => $row['description'] ?? null, 'paid_to' => $row['paidTo'] ?? null,
                        'status' => $row['status'] ?? 'completed', 'created_by' => $admin->id, 'is_demo' => true,
                    ],
                );
            }

            foreach ($data['monthlyDonations'] ?? [] as $row) {
                $member = $members[$row['memberId'] ?? ''] ?? null;
                if (! $member) {
                    continue;
                }

                MonthlyDonation::updateOrCreate(
                    ['member_id' => $member->id, 'month' => $row['month'], 'year' => $row['year']],
                    [
                        'expected_amount' => $row['expectedAmount'] ?? 0, 'paid_amount' => $row['paidAmount'] ?? 0,
                        'payment_date' => $toDate($row['paymentDate'] ?? null), 'payment_method' => $row['paymentMethod'] ?? null,
                        'voucher_no' => $row['voucherNo'] ?? null, 'status' => $row['status'] ?? 'pending', 'notes' => $row['notes'] ?? null,
                    ],
                );
            }

            foreach ($data['welfareRequests'] ?? [] as $row) {
                WelfareRequest::updateOrCreate(
                    ['legacy_id' => $row['id']],
                    [
                        'tracking_no' => $row['trackingNo'], 'applicant_name' => $row['applicantName'],
                        'guardian_name' => $row['guardianName'] ?? null, 'phone' => $row['phone'], 'village' => $row['village'],
                        'assistance_type' => $row['assistanceType'], 'description' => $row['description'],
                        'requested_amount' => $row['requestedAmount'], 'approved_amount' => $row['approvedAmount'] ?? null,
                        'status' => $row['status'] ?? 'submitted', 'verification_notes' => $row['verificationNotes'] ?? null,
                        'disbursed_date' => $toDate($row['disbursedDate'] ?? null), 'created_by' => $admin->id, 'reviewed_by' => $admin->id,
                    ],
                );
            }

            foreach ($data['auditLogs'] ?? [] as $row) {
                AuditLog::updateOrCreate(
                    ['record_id' => $row['recordId'] ?? null, 'action' => $row['action'] ?? 'IMPORT'],
                    [
                        'user_id' => $admin->id, 'module' => $row['module'] ?? 'system', 'record_type' => 'prototype_import',
                        'details' => $row['details'] ?? null, 'created_at' => $row['timestamp'] ?? now(), 'updated_at' => now(),
                    ],
                );
            }
        });

        $this->command?->info('UKPJS prototype data imported as demo data. Set UKPJS_SEED_ADMIN_PASSWORD before seeding non-demo credentials.');
    }
}
