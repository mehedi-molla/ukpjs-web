<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['income', 'expense'])],
            'fund_type' => ['required', Rule::in(['general_hadiya', 'monthly_donation', 'project_donation', 'zakat', 'sadaqah', 'special_campaign', 'emergency_fund'])],
            'category_id' => ['nullable', 'string', 'max:100'],
            'category_name' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'decimal:0,2', 'gt:0', 'max:999999999999.99'],
            'occurred_at' => ['required', 'date'],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'member_id' => ['nullable', 'integer', 'exists:members,id'],
            'donor_name' => ['nullable', 'string', 'max:255'],
            'is_anonymous' => ['sometimes', 'boolean'],
            'payment_method' => ['required', Rule::in(['cash', 'bkash', 'nagad', 'rocket', 'bank', 'other'])],
            'reference_no' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'paid_to' => ['nullable', 'string', 'max:255'],
            'attachment_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
        ];
    }
}
