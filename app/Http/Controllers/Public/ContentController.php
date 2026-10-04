<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\BloodDonor;
use App\Models\Contact;
use App\Models\Member;
use App\Models\Notice;
use App\Models\Project;
use App\Models\Transaction;
use App\Models\WebsiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function __invoke(string $page): Response
    {
        return $this->show($page);
    }

    public function show(string $page): Response
    {
        abort_unless(in_array($page, [
            'about', 'emergency', 'contact', 'blood-donors', 'donation', 'notices',
            'transparency', 'welfare', 'committee',
        ], true), 404);

        $settings = WebsiteSetting::query()->first();
        $validTransactions = Transaction::query()->where('status', 'completed')->where('is_demo', false);
        $income = (float) (clone $validTransactions)->where('type', 'income')->sum('amount');
        $expense = (float) (clone $validTransactions)->where('type', 'expense')->sum('amount');

        return Inertia::render('Public/Content', [
            'page' => $page,
            'settings' => $this->settings($settings),
            'contacts' => Contact::query()->with(['category', 'media'])->where('is_published', true)->orderBy('sort_order')->get()
                ->map(fn (Contact $contact): array => $this->contact($contact))->values(),
            'notices' => Notice::query()->where('is_active', true)->latest('publish_date')->get()->map(fn (Notice $notice): array => $this->notice($notice))->values(),
            'projects' => ProjectResource::collection(Project::query()->where('is_published', true)->with('media')->withSum('validIncomeTransactions as collected_amount', 'amount')->withSum('validExpenseTransactions as expense_amount', 'amount')->latest()->get())->resolve(),
            'financials' => $this->financials($validTransactions, $income, $expense),
            'transactions' => $this->transactions($validTransactions),
            'members' => Member::query()->where('is_active', true)->where('is_public_profile', true)->latest()->get()->map(fn (Member $member): array => $this->member($member))->values(),
            'bloodDonors' => BloodDonor::query()->where('is_public', true)->where('is_available', true)->where('is_verified', true)->where('is_demo', false)->latest()->get()->map(fn (BloodDonor $donor): array => $this->bloodDonor($donor))->values(),
        ]);
    }

    private function financials($query, float $income, float $expense): array
    {
        $totals = (clone $query)->where('type', 'income')->selectRaw('fund_type, SUM(amount) as total')->groupBy('fund_type')->pluck('total', 'fund_type')->map(fn ($value): float => (float) $value);

        return [
            'totalIncome' => $income, 'totalExpense' => $expense, 'currentBalance' => $income - $expense,
            'totalGeneralHadiya' => $totals->get('general_hadiya', 0), 'totalMonthlyDonation' => $totals->get('monthly_donation', 0),
            'totalProjectDonation' => $totals->get('project_donation', 0), 'totalZakat' => $totals->get('zakat', 0), 'totalSadaqah' => $totals->get('sadaqah', 0),
            'thisMonthIncome' => $this->periodTotal($query, 'income', now()->startOfMonth(), now()->endOfMonth()), 'thisMonthExpense' => $this->periodTotal($query, 'expense', now()->startOfMonth(), now()->endOfMonth()),
            'lastMonthIncome' => $this->periodTotal($query, 'income', now()->subMonthNoOverflow()->startOfMonth(), now()->subMonthNoOverflow()->endOfMonth()), 'lastMonthExpense' => $this->periodTotal($query, 'expense', now()->subMonthNoOverflow()->startOfMonth(), now()->subMonthNoOverflow()->endOfMonth()),
        ];
    }

    private function periodTotal($query, string $type, $from, $to): float
    {
        return (float) (clone $query)->where('type', $type)->whereBetween('occurred_at', [$from, $to])->sum('amount');
    }

    private function transactions($query): array
    {
        return (clone $query)->with(['project:id,title_bn,title_en', 'member:id,name_bn,name_en'])->latest('occurred_at')->limit(150)->get()->map(fn (Transaction $transaction): array => [
            'id' => (string) $transaction->id, 'voucherNo' => $transaction->voucher_no, 'type' => $transaction->type, 'fundType' => $transaction->fund_type,
            'categoryId' => $transaction->category_id ?? '', 'categoryName' => $transaction->category_name ?? '', 'amount' => (float) $transaction->amount,
            'date' => $transaction->occurred_at?->toDateString() ?? '', 'projectId' => $transaction->project_id ? (string) $transaction->project_id : null,
            'projectName' => $transaction->project?->title_en, 'memberId' => null, 'memberName' => null, 'donorName' => null,
            'isAnonymous' => true, 'paymentMethod' => $transaction->payment_method ?? 'other', 'referenceNo' => $transaction->reference_no,
            'description' => $transaction->description ?? '', 'paidTo' => null, 'enteredBy' => 'Organization', 'status' => $transaction->status,
            'createdAt' => $transaction->created_at?->toIso8601String() ?? '',
        ])->all();
    }

    private function notice(Notice $notice): array
    {
        return ['id' => (string) $notice->id, 'titleBn' => $notice->title_bn, 'titleEn' => $notice->title_en ?? '', 'contentBn' => $notice->content_bn ?? '', 'contentEn' => $notice->content_en ?? '', 'publishDate' => $notice->publish_date?->toDateString(), 'date' => $notice->publish_date?->toDateString(), 'isPinned' => $notice->is_pinned, 'isActive' => $notice->is_active, 'createdAt' => $notice->created_at?->toIso8601String()];
    }

    private function member(Member $member): array
    {
        return ['id' => (string) $member->id, 'memberId' => $member->member_no, 'nameBn' => $member->name_bn, 'nameEn' => $member->name_en ?? '', 'phone' => $member->phone ?? '', 'whatsapp' => $member->whatsapp, 'email' => $member->email, 'addressBn' => $member->address_bn ?? '', 'addressEn' => $member->address_en ?? '', 'village' => $member->village ?? '', 'country' => $member->country ?? '', 'occupationBn' => $member->occupation_bn, 'occupationEn' => $member->occupation_en, 'memberType' => $member->member_type, 'monthlyPledgeAmount' => (float) $member->monthly_pledge_amount, 'joiningDate' => $member->joining_date?->toDateString(), 'isActive' => $member->is_active, 'isPublicProfile' => $member->is_public_profile, 'createdAt' => $member->created_at?->toIso8601String()];
    }

    private function bloodDonor(BloodDonor $donor): array
    {
        return [
            'id' => (string) $donor->id, 'nameBn' => $donor->name_bn, 'nameEn' => $donor->name_en ?? '',
            'bloodGroup' => $donor->blood_group, 'areaBn' => $donor->area_bn, 'areaEn' => $donor->area_en,
            'phone' => $donor->phone, 'lastDonationDate' => $donor->last_donation_date?->toDateString(),
            'isAvailable' => $donor->is_available, 'isPublic' => true,
        ];
    }

    private function settings(?WebsiteSetting $settings): ?array
    {
        if (! $settings) {
            return null;
        }

        return [
            'orgNameBn' => $settings->org_name_bn, 'orgNameEn' => $settings->org_name_en,
            'sloganBn' => $settings->slogan_bn, 'sloganEn' => $settings->slogan_en,
            'establishedYear' => $settings->established_year, 'logoUrl' => $this->assetPath($settings->logo_path),
            'addressBn' => $settings->address_bn, 'addressEn' => $settings->address_en,
            'contactPhone' => $settings->contact_phone ?? '', 'contactEmail' => $settings->contact_email ?? '',
            'whatsappNumber' => $settings->whatsapp_number ?? '', 'facebookUrl' => $settings->facebook_url ?? '',
            'youtubeUrl' => $settings->youtube_url ?? '', 'missionBn' => $settings->mission_bn ?? '',
            'missionEn' => $settings->mission_en ?? '', 'visionBn' => $settings->vision_bn ?? '',
            'visionEn' => $settings->vision_en ?? '', 'aboutHistoryBn' => $settings->about_history_bn ?? '',
            'aboutHistoryEn' => $settings->about_history_en ?? '', 'donationInstructionsBn' => $settings->donation_instructions_bn ?? '',
            'donationInstructionsEn' => $settings->donation_instructions_en ?? '', 'bkashNumber' => $settings->bkash_number ?? '',
            'nagadNumber' => $settings->nagad_number ?? '', 'rocketNumber' => $settings->rocket_number ?? '',
            'bankAccountDetails' => $settings->bank_account_details ?? '', 'currencySymbol' => $settings->currency_symbol ?? 'BDT',
            'isPublicTransparencyEnabled' => (bool) $settings->is_public_transparency_enabled,
        ];
    }

    private function contact(Contact $contact): array
    {
        $isDemo = (bool) $contact->is_demo;
        $isPubliclyVerified = $contact->is_verified && ! $isDemo;

        return [
            'id' => (string) $contact->id, 'categoryId' => $contact->category?->slug, 'category' => $contact->category?->slug,
            'categoryNameBn' => $contact->category?->name_bn ?? '', 'categoryNameEn' => $contact->category?->name_en,
            'nameBn' => $contact->name_bn, 'nameEn' => $contact->name_en ?? '', 'designationBn' => $contact->designation_bn,
            'designationEn' => $contact->designation_en, 'phone' => $isPubliclyVerified ? ($contact->phone ?? '') : '',
            'altPhone' => $isPubliclyVerified ? $contact->alt_phone : null, 'whatsapp' => $isPubliclyVerified ? $contact->whatsapp : null,
            'addressBn' => $contact->address_bn, 'addressEn' => $contact->address_en, 'area' => $contact->area,
            'ward' => $contact->ward, 'unionName' => $contact->union_name, 'serviceAreaBn' => $contact->service_area,
            'isEmergency' => $contact->is_emergency, 'availabilityBn' => $contact->availability,
            'descriptionBn' => $contact->description_bn, 'descriptionEn' => $contact->description_en,
            'photoUrl' => $contact->getFirstMediaUrl('portrait') ?: $this->assetPath($contact->photo_path), 'vehiclePhotoUrl' => $contact->getFirstMediaUrl('vehicle') ?: $this->assetPath($contact->vehicle_photo_path),
            'isFeatured' => $contact->is_featured, 'isVerified' => $isPubliclyVerified,
            'lastVerifiedAt' => optional($contact->last_verified_at)->toDateString(), 'isPublished' => $contact->is_published,
            'isDemoPlaceholder' => $isDemo, 'sortOrder' => $contact->sort_order,
        ];
    }

    private function assetPath(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, '/src/assets/images/')
            ? '/images/'.basename($path)
            : (str_starts_with($path, '/') ? $path : '/'.$path);
    }
}
