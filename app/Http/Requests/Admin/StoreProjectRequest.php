<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', Rule::unique('projects', 'code')->ignore($this->route('project'))],
            'title_bn' => ['required', 'string', 'max:255'], 'title_en' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'], 'short_desc_bn' => ['nullable', 'string', 'max:1000'],
            'short_desc_en' => ['nullable', 'string', 'max:1000'], 'full_desc_bn' => ['nullable', 'string', 'max:10000'],
            'full_desc_en' => ['nullable', 'string', 'max:10000'], 'featured_image' => ['nullable', 'string', 'max:500'],
            'featured_image_file' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'gallery_files' => ['nullable', 'array', 'max:12'],
            'gallery_files.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'start_date' => ['nullable', 'date'], 'estimated_end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'estimated_budget' => ['required', 'numeric', 'decimal:0,2', 'min:0'],
            'status' => ['required', Rule::in(['upcoming', 'running', 'completed'])], 'location' => ['nullable', 'string', 'max:255'],
            'beneficiaries_count' => ['nullable', 'integer', 'min:0'], 'is_published' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'], 'is_demo' => ['sometimes', 'boolean'],
        ];
    }
}
