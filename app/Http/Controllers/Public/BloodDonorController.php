<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreBloodDonorRequest;
use App\Models\BloodDonor;
use Illuminate\Http\RedirectResponse;

class BloodDonorController extends Controller
{
    public function store(StoreBloodDonorRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        BloodDonor::create([
            'name_bn' => $validated['name'], 'name_en' => $validated['name'], 'blood_group' => $validated['blood_group'],
            'phone' => $validated['phone'], 'area_bn' => $validated['area'] ?? null, 'area_en' => $validated['area'] ?? null,
            'last_donation_date' => $validated['last_donation_date'] ?? null, 'is_available' => true,
            'is_public' => false, 'is_verified' => false, 'is_demo' => false,
        ]);

        return back()->with('success', 'Blood donor registration received for administrator verification.');
    }
}
