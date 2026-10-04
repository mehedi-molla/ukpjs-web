<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWelfareRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'applicant_name' => ['required', 'string', 'max:255'], 'guardian_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'], 'village' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['medical', 'food', 'education', 'shelter_repair', 'debt_relief', 'marriage_help', 'emergency_repair', 'other'])],
            'requested_amount' => ['nullable', 'numeric', 'decimal:0,2', 'min:0', 'max:999999999999.99'],
            'description' => ['required', 'string', 'max:5000'],
        ];
    }
}
