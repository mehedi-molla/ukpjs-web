<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ContactMessageFilterRequest;
use App\Http\Requests\Admin\ReviewContactMessageRequest;
use App\Models\AuditLog;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(ContactMessageFilterRequest $request): Response
    {
        $filters = $request->validated();
        $query = ContactMessage::query()->latest();
        $query->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(fn ($inner) => $inner->where('name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%")->orWhere('message', 'like', "%{$search}%")));
        $query->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status));

        return Inertia::render('Admin/ContactMessages', [
            'filters' => $filters,
            'messages' => $query->paginate(25)->withQueryString()->through(fn (ContactMessage $message): array => [
                'id' => $message->id, 'name' => $message->name, 'phone' => $message->phone,
                'message' => $message->message, 'status' => $message->status, 'createdAt' => $message->created_at?->toIso8601String(),
            ]),
        ]);
    }

    public function review(ReviewContactMessageRequest $request, ContactMessage $contactMessage): RedirectResponse
    {
        $validated = $request->validated();
        $before = ['status' => $contactMessage->status];
        $contactMessage->update([
            'status' => $validated['status'], 'reviewed_by' => $request->user()->id, 'reviewed_at' => now(),
        ]);
        AuditLog::create([
            'user_id' => $request->user()->id, 'action' => 'reviewed', 'module' => 'contact_messages',
            'record_type' => ContactMessage::class, 'record_id' => (string) $contactMessage->id,
            'details' => 'Public contact message status updated.', 'old_values' => $before,
            'new_values' => ['status' => $validated['status']], 'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Contact message status updated.');
    }

    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        $name = $contactMessage->name ?? $contactMessage->phone ?? $contactMessage->id;
        $contactMessage->delete();

        AuditLog::create([
            'user_id' => request()->user()->id,
            'action' => 'deleted',
            'module' => 'contact_messages',
            'record_type' => ContactMessage::class,
            'record_id' => (string) $contactMessage->id,
            'details' => "Contact message from '{$name}' permanently deleted.",
            'ip_address' => request()->ip(),
        ]);

        return back()->with('success', 'Contact message deleted successfully.');
    }
}
