<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'org_name_bn', 'org_name_en', 'slogan_bn', 'slogan_en', 'established_year', 'logo_path',
        'address_bn', 'address_en', 'contact_phone', 'contact_email', 'whatsapp_number', 'facebook_url',
        'youtube_url', 'mission_bn', 'mission_en', 'vision_bn', 'vision_en', 'about_history_bn',
        'about_history_en', 'donation_instructions_bn', 'donation_instructions_en', 'bkash_number',
        'nagad_number', 'rocket_number', 'bank_account_details', 'currency_symbol', 'is_public_transparency_enabled',
    ];

    protected function casts(): array
    {
        return ['is_public_transparency_enabled' => 'boolean'];
    }
}
