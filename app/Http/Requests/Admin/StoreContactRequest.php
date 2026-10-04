<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:contact_categories,id'], 'name_bn' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'], 'designation_bn' => ['nullable', 'string', 'max:255'],
            'designation_en' => ['nullable', 'string', 'max:255'], 'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'], 'area' => ['nullable', 'string', 'max:255'],
            'ward' => ['nullable', 'string', 'max:100'], 'service_area' => ['nullable', 'string', 'max:255'],
            'photo_path' => ['nullable', 'string', 'max:500'], 'is_emergency' => ['sometimes', 'boolean'],
            'photo_file' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'vehicle_photo_file' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'is_verified' => ['sometimes', 'boolean'], 'is_published' => ['sometimes', 'boolean'], 'is_demo' => ['sometimes', 'boolean'],
        ];
    }
}
