<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewWelfareRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['under_review', 'verified', 'approved', 'rejected', 'disbursed'])],
            'approved_amount' => ['nullable', 'numeric', 'decimal:0,2', 'gt:0', 'max:999999999999.99'],
            'verification_notes' => ['nullable', 'string', 'max:5000'],
            'fund_type' => ['required', Rule::in(['general_hadiya', 'zakat', 'sadaqah', 'emergency_fund'])],
        ];
    }
}
