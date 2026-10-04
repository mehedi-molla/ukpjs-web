<?php

namespace App\Http\Requests\Admin;

use App\Models\MonthlyDonation;
use Illuminate\Foundation\Http\FormRequest;

class StoreMonthlyDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'member_id' => ['required', 'integer', 'exists:members,id'],
            'month' => ['required', 'integer', 'between:1,12'],
            'year' => ['required', 'integer', 'between:2020,2100'],
            'expected_amount' => ['required', 'numeric', 'decimal:0,2', 'min:0', 'max:999999999999.99'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if ($this->filled(['member_id', 'month', 'year']) && MonthlyDonation::query()->where('member_id', $this->integer('member_id'))->where('month', $this->integer('month'))->where('year', $this->integer('year'))->exists()) {
                $validator->errors()->add('member_id', 'A commitment already exists for this member and month.');
            }
        });
    }
}
