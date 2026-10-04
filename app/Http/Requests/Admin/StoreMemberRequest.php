<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'member_no' => ['required', 'string', 'max:50', Rule::unique('members', 'member_no')->ignore($this->route('member'))],
            'name_bn' => ['required', 'string', 'max:255'], 'name_en' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'], 'email' => ['nullable', 'email', 'max:255'],
            'village' => ['nullable', 'string', 'max:255'], 'country' => ['nullable', 'string', 'max:100'],
            'member_type' => ['required', Rule::in(['general', 'executive', 'probashi', 'volunteer'])],
            'monthly_pledge_amount' => ['nullable', 'numeric', 'decimal:0,2', 'min:0', 'max:999999999999.99'],
            'is_active' => ['sometimes', 'boolean'], 'is_public_profile' => ['sometimes', 'boolean'],
        ];
    }
}
