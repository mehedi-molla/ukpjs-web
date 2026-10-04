<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WelfareFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(['submitted', 'under_review', 'verified', 'approved', 'rejected', 'disbursed'])],
            'assistance_type' => ['nullable', 'string', 'max:100'],
        ];
    }
}
