<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodDonor extends Model
{
    use HasFactory;

    protected $fillable = [
        'legacy_id', 'name_bn', 'name_en', 'blood_group', 'area_bn', 'area_en', 'phone',
        'last_donation_date', 'is_available', 'is_public', 'is_verified', 'is_demo', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'last_donation_date' => 'date', 'is_available' => 'boolean', 'is_public' => 'boolean',
            'is_verified' => 'boolean', 'is_demo' => 'boolean',
        ];
    }
}
