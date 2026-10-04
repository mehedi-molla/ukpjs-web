<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MonthlyDonationFilterRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('year')) {
            $this->merge(['year' => $this->integer('year')]);
        }
    }

    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'year' => ['nullable', 'integer', 'between:2020,2100'],
            'status' => ['nullable', Rule::in(['pending', 'partial', 'paid'])],
            'search' => ['nullable', 'string', 'max:100'],
        ];
    }
}
