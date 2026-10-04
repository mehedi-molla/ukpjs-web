<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWebsiteSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'org_name_bn' => ['required', 'string', 'max:255'], 'org_name_en' => ['required', 'string', 'max:255'],
            'slogan_bn' => ['nullable', 'string', 'max:255'], 'slogan_en' => ['nullable', 'string', 'max:255'],
            'address_bn' => ['nullable', 'string', 'max:2000'], 'address_en' => ['nullable', 'string', 'max:2000'],
            'contact_phone' => ['nullable', 'string', 'max:30'], 'contact_email' => ['nullable', 'email', 'max:255'],
            'whatsapp_number' => ['nullable', 'string', 'max:30'], 'facebook_url' => ['nullable', 'url', 'max:500'],
            'youtube_url' => ['nullable', 'url', 'max:500'], 'mission_bn' => ['nullable', 'string', 'max:10000'],
            'mission_en' => ['nullable', 'string', 'max:10000'], 'vision_bn' => ['nullable', 'string', 'max:10000'],
            'vision_en' => ['nullable', 'string', 'max:10000'], 'about_history_bn' => ['nullable', 'string', 'max:10000'],
            'about_history_en' => ['nullable', 'string', 'max:10000'], 'donation_instructions_bn' => ['nullable', 'string', 'max:10000'],
            'donation_instructions_en' => ['nullable', 'string', 'max:10000'], 'bkash_number' => ['nullable', 'string', 'max:30'],
            'nagad_number' => ['nullable', 'string', 'max:30'], 'rocket_number' => ['nullable', 'string', 'max:30'],
            'bank_account_details' => ['nullable', 'string', 'max:2000'], 'currency_symbol' => ['required', 'string', 'max:10'],
            'is_public_transparency_enabled' => ['sometimes', 'boolean'],
        ];
    }
}
