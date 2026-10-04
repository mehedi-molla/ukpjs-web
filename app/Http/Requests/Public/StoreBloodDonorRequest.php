<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBloodDonorRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'blood_group' => ['required', Rule::in(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])],
            'phone' => ['required', 'string', 'max:30'],
            'area' => ['nullable', 'string', 'max:255'],
            'last_donation_date' => ['nullable', 'date', 'before_or_equal:today'],
        ];
    }
}
