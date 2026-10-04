<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateWebsiteSettingRequest;
use App\Models\AuditLog;
use App\Models\WebsiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Settings', [
            'settings' => WebsiteSetting::query()->first(),
            'logs' => AuditLog::query()->where('module', 'settings')->with('user:id,name')->latest()->limit(20)->get()->map(fn (AuditLog $log): array => [
                'id' => $log->id, 'action' => $log->action, 'details' => $log->details,
                'actor' => $log->user?->name ?? 'System', 'createdAt' => $log->created_at?->toIso8601String(),
            ])->values(),
        ]);
    }

    public function update(UpdateWebsiteSettingRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        DB::transaction(function () use ($validated, $request): void {
            $settings = WebsiteSetting::query()->first();
            $oldValues = $settings?->only(array_keys($validated)) ?? [];
            $settings = WebsiteSetting::query()->updateOrCreate(['id' => 1], $validated);

            AuditLog::create([
                'user_id' => $request->user()->id, 'action' => 'updated', 'module' => 'settings',
                'record_type' => WebsiteSetting::class, 'record_id' => (string) $settings->id,
                'details' => 'Website settings updated by administrator.', 'old_values' => $oldValues,
                'new_values' => $settings->only(array_keys($validated)), 'ip_address' => $request->ip(),
            ]);
        });

        return back()->with('success', 'Website settings updated successfully.');
    }
}
