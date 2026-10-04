<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DonationSubmissionFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(['pending', 'approved', 'rejected'])],
            'fund_type' => ['nullable', Rule::in(['general_hadiya', 'monthly_donation', 'project_donation', 'zakat', 'sadaqah', 'special_campaign', 'emergency_fund'])],
        ];
    }
}
