<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDonationSubmissionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'donor_name' => ['nullable', 'string', 'max:255'], 'phone' => ['nullable', 'string', 'max:30'],
            'amount' => ['required', 'numeric', 'decimal:0,2', 'gt:0', 'max:999999999999.99'],
            'fund_type' => ['required', Rule::in(['general_hadiya', 'monthly_donation', 'project_donation', 'zakat', 'sadaqah'])],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'payment_method' => ['required', Rule::in(['cash', 'bkash', 'nagad', 'rocket', 'bank', 'other'])],
            'reference_no' => ['nullable', 'string', 'max:255'], 'notes' => ['nullable', 'string', 'max:2000'],
            'is_anonymous' => ['sometimes', 'boolean'],
        ];
    }
}
