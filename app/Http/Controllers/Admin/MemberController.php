<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MemberFilterRequest;
use App\Http\Requests\Admin\StoreMemberRequest;
use App\Models\AuditLog;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(MemberFilterRequest $request): Response
    {
        $filters = $request->validated();
        $query = Member::query();
        $query->when($filters['search'] ?? null, function ($query, string $search): void {
            $query->where(function ($query) use ($search): void {
                $query->where('member_no', 'like', "%{$search}%")
                    ->orWhere('name_bn', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        });
        $query->when($filters['member_type'] ?? null, fn ($query, string $memberType) => $query->where('member_type', $memberType));
        $query->when($filters['country'] ?? null, fn ($query, string $country) => $query->where('country', 'like', "%{$country}%"));
        if (array_key_exists('is_active', $filters)) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        return Inertia::render('Admin/MemberManagement', ['filters' => $filters, 'members' => $query->latest()->paginate(25)->withQueryString()->through(fn (Member $member): array => [
            'id' => $member->id, 'memberNo' => $member->member_no, 'nameBn' => $member->name_bn, 'nameEn' => $member->name_en,
            'phone' => $member->phone, 'email' => $member->email, 'village' => $member->village, 'country' => $member->country,
            'memberType' => $member->member_type, 'monthlyPledgeAmount' => (float) $member->monthly_pledge_amount,
            'isActive' => $member->is_active, 'isPublicProfile' => $member->is_public_profile,
        ])]);
    }

    public function store(StoreMemberRequest $request): RedirectResponse
    {
        Member::create($request->validated());

        return back()->with('success', 'Member created successfully.');
    }

    public function update(StoreMemberRequest $request, Member $member): RedirectResponse
    {
        $member->update($request->validated());

        return back()->with('success', 'Member updated successfully.');
    }

    public function archive(Member $member): RedirectResponse
    {
        $before = $member->only(['is_active', 'is_public_profile']);
        $member->update(['is_active' => false, 'is_public_profile' => false]);

        AuditLog::create([
            'user_id' => request()->user()->id, 'action' => 'archived', 'module' => 'members',
            'record_type' => Member::class, 'record_id' => (string) $member->id,
            'details' => 'Member deactivated without deleting contribution history.',
            'old_values' => $before, 'new_values' => ['is_active' => false, 'is_public_profile' => false],
            'ip_address' => request()->ip(),
        ]);

        return back()->with('success', 'Member deactivated and contribution history retained.');
    }
}
