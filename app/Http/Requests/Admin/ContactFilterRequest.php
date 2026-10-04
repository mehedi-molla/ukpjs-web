<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ContactFilterRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge(array_filter([
            'is_verified' => $this->has('is_verified') ? filter_var($this->input('is_verified'), FILTER_VALIDATE_BOOLEAN) : null,
            'is_published' => $this->has('is_published') ? filter_var($this->input('is_published'), FILTER_VALIDATE_BOOLEAN) : null,
            'is_demo' => $this->has('is_demo') ? filter_var($this->input('is_demo'), FILTER_VALIDATE_BOOLEAN) : null,
            'is_emergency' => $this->has('is_emergency') ? filter_var($this->input('is_emergency'), FILTER_VALIDATE_BOOLEAN) : null,
        ], fn ($value): bool => $value !== null));
    }

    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'integer', 'exists:contact_categories,id'],
            'is_verified' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'is_demo' => ['nullable', 'boolean'],
            'is_emergency' => ['nullable', 'boolean'],
        ];
    }
}
