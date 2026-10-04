<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NoticeFilterRequest;
use App\Http\Requests\Admin\StoreNoticeRequest;
use App\Models\AuditLog;
use App\Models\Notice;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NoticeController extends Controller
{
    public function index(NoticeFilterRequest $request): Response
    {
        $filters = $request->validated();
        $query = Notice::query()->latest('publish_date');
        $query->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(fn ($inner) => $inner->where('title_bn', 'like', "%{$search}%")->orWhere('title_en', 'like', "%{$search}%")->orWhere('content_bn', 'like', "%{$search}%")->orWhere('content_en', 'like', "%{$search}%")));
        $query->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('is_active', $status === 'active'));

        return Inertia::render('Admin/NoticeManagement', ['filters' => $filters, 'notices' => $query->paginate(25)->withQueryString()->through(fn (Notice $notice): array => [
            'id' => $notice->id, 'titleBn' => $notice->title_bn, 'titleEn' => $notice->title_en, 'contentBn' => $notice->content_bn,
            'contentEn' => $notice->content_en, 'publishDate' => $notice->publish_date?->toDateString(), 'isPinned' => $notice->is_pinned, 'isActive' => $notice->is_active,
        ])]);
    }

    public function store(StoreNoticeRequest $request): RedirectResponse
    {
        Notice::create([...$request->validated(), 'created_by' => $request->user()->id]);

        return back()->with('success', 'Notice published successfully.');
    }

    public function update(StoreNoticeRequest $request, Notice $notice): RedirectResponse
    {
        $notice->update($request->validated());

        return back()->with('success', 'Notice updated successfully.');
    }

    public function archive(Notice $notice): RedirectResponse
    {
        $notice->update(['is_active' => false]);
        AuditLog::create([
            'user_id' => request()->user()->id, 'action' => 'archived', 'module' => 'notices',
            'record_type' => Notice::class, 'record_id' => (string) $notice->id,
            'details' => 'Notice unpublished without deleting the announcement history.',
            'new_values' => ['is_active' => false], 'ip_address' => request()->ip(),
        ]);

        return back()->with('success', 'Notice archived from public view.');
    }
}
