<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreNoticeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'title_bn' => ['required', 'string', 'max:255'], 'title_en' => ['nullable', 'string', 'max:255'],
            'content_bn' => ['required', 'string', 'max:10000'], 'content_en' => ['nullable', 'string', 'max:10000'],
            'publish_date' => ['nullable', 'date'], 'is_pinned' => ['sometimes', 'boolean'], 'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
