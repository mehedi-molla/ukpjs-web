<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ContactFilterRequest;
use App\Http\Requests\Admin\StoreContactRequest;
use App\Models\AuditLog;
use App\Models\Contact;
use App\Models\ContactCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(ContactFilterRequest $request): Response
    {
        $filters = $request->validated();
        $query = Contact::query()->with(['category', 'media']);
        $query->when($filters['search'] ?? null, function ($query, string $search): void {
            $query->where(function ($query) use ($search): void {
                $query->where('name_bn', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('whatsapp', 'like', "%{$search}%")
                    ->orWhere('area', 'like', "%{$search}%")
                    ->orWhere('service_area', 'like', "%{$search}%");
            });
        });
        $query->when($filters['category_id'] ?? null, fn ($query, int $categoryId) => $query->where('category_id', $categoryId));
        foreach (['is_verified', 'is_published', 'is_demo', 'is_emergency'] as $booleanFilter) {
            if (array_key_exists($booleanFilter, $filters)) {
                $query->where($booleanFilter, (bool) $filters[$booleanFilter]);
            }
        }

        return Inertia::render('Admin/ContactManagement', [
            'filters' => $filters,
            'contacts' => $query->orderBy('sort_order')->paginate(30)->withQueryString()->through(fn (Contact $contact): array => $this->present($contact)),
            'categories' => ContactCategory::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'slug', 'name_bn', 'name_en'])->map(fn (ContactCategory $category): array => [
                'id' => $category->id, 'slug' => $category->slug, 'nameBn' => $category->name_bn, 'nameEn' => $category->name_en,
            ])->values(),
        ]);
    }

    public function store(StoreContactRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $photo = $data['photo_file'] ?? null;
        $vehiclePhoto = $data['vehicle_photo_file'] ?? null;
        unset($data['photo_file'], $data['vehicle_photo_file']);

        $contact = Contact::create($data);
        $this->attachMedia($contact, $request, $photo, $vehiclePhoto);

        return back()->with('success', 'Contact saved successfully.');
    }

    public function update(StoreContactRequest $request, Contact $contact): RedirectResponse
    {
        $data = $request->validated();
        $photo = $data['photo_file'] ?? null;
        $vehiclePhoto = $data['vehicle_photo_file'] ?? null;
        unset($data['photo_file'], $data['vehicle_photo_file']);

        $contact->update($data);
        $this->attachMedia($contact, $request, $photo, $vehiclePhoto);

        return back()->with('success', 'Contact updated successfully.');
    }

    public function archive(Contact $contact): RedirectResponse
    {
        $contact->update(['is_published' => false]);
        AuditLog::create([
            'user_id' => request()->user()->id, 'action' => 'archived', 'module' => 'contacts',
            'record_type' => Contact::class, 'record_id' => (string) $contact->id,
            'details' => 'Contact removed from public directory without deleting the record.',
            'new_values' => ['is_published' => false], 'ip_address' => request()->ip(),
        ]);

        return back()->with('success', 'Contact archived from public view.');
    }

    private function present(Contact $contact): array
    {
        return [
            'id' => $contact->id, 'categoryId' => $contact->category_id, 'nameBn' => $contact->name_bn, 'nameEn' => $contact->name_en,
            'designationBn' => $contact->designation_bn, 'designationEn' => $contact->designation_en, 'category' => $contact->category?->name_en,
            'phone' => $contact->phone, 'whatsapp' => $contact->whatsapp, 'area' => $contact->area, 'ward' => $contact->ward,
            'serviceArea' => $contact->service_area, 'isEmergency' => $contact->is_emergency, 'isVerified' => $contact->is_verified,
            'isPublished' => $contact->is_published, 'isDemoPlaceholder' => $contact->is_demo,
            'photoUrl' => $contact->getFirstMediaUrl('portrait') ?: $contact->photo_path,
            'vehiclePhotoUrl' => $contact->getFirstMediaUrl('vehicle') ?: $contact->vehicle_photo_path,
        ];
    }

    private function attachMedia(Contact $contact, StoreContactRequest $request, mixed $photo, mixed $vehiclePhoto): void
    {
        if ($request->hasFile('photo_file')) {
            $contact->addMedia($photo)->toMediaCollection('portrait');
        }

        if ($request->hasFile('vehicle_photo_file')) {
            $contact->addMedia($vehiclePhoto)->toMediaCollection('vehicle');
        }
    }
}
