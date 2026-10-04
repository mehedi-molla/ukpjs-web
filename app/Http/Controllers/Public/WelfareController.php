<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreWelfareRequest;
use App\Models\WelfareRequest as WelfareRequestModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class WelfareController extends Controller
{
    public function store(StoreWelfareRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        WelfareRequestModel::create([
            'applicant_name' => $validated['applicant_name'],
            'guardian_name' => $validated['guardian_name'] ?? null,
            'phone' => $validated['phone'],
            'village' => $validated['village'],
            'assistance_type' => $validated['category'],
            'requested_amount' => $validated['requested_amount'] ?? 0,
            'description' => $validated['description'],
            'tracking_no' => 'UKPJS-WEL-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
            'status' => 'submitted',
        ]);

        return back()->with('success', 'Welfare application submitted securely.');
    }
}
