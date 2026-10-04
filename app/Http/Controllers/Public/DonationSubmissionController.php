<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreDonationSubmissionRequest;
use App\Models\DonationSubmission;
use Illuminate\Http\RedirectResponse;

class DonationSubmissionController extends Controller
{
    public function store(StoreDonationSubmissionRequest $request): RedirectResponse
    {
        DonationSubmission::create([
            ...$request->validated(),
            'status' => 'pending',
            'donor_name' => $request->boolean('is_anonymous') ? null : $request->validated('donor_name'),
        ]);

        return back()->with('success', 'Donation notification received for administrator review.');
    }
}
