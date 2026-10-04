<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LedgerFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', Rule::in(['income', 'expense'])],
            'fund_type' => ['nullable', Rule::in(['general_hadiya', 'monthly_donation', 'project_donation', 'zakat', 'sadaqah', 'special_campaign', 'emergency_fund'])],
            'status' => ['nullable', Rule::in(['completed', 'cancelled'])],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ];
    }
}
