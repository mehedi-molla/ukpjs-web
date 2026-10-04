<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmergencyContactResource;
use App\Http\Resources\EmergencyServiceResource;
use App\Models\ContactCategory;
use Inertia\Inertia;
use Inertia\Response;

class EmergencyServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/EmergencyServices', [
            'services' => EmergencyServiceResource::collection(ContactCategory::query()->emergencyServices()->get())->resolve(),
        ]);
    }

    public function show(string $category): Response
    {
        // URLs use hyphens (/emergency/fire-service); stored slugs use underscores.
        abort_if(str_contains($category, '_'), 404);

        $service = ContactCategory::query()->emergencyServices()
            ->where('slug', str_replace('-', '_', $category))
            ->firstOrFail();

        $entries = $service->contacts()->with('media')->where('is_published', true)
            ->orderBy('sort_order')->orderBy('id')->get();

        return Inertia::render('Public/EmergencyServiceCategory', [
            'service' => (new EmergencyServiceResource($service))->resolve(),
            'entries' => EmergencyContactResource::collection($entries)->resolve(),
        ]);
    }
}
