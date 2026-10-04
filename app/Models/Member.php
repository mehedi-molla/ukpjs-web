<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'legacy_id', 'member_no', 'name_bn', 'name_en', 'phone', 'whatsapp', 'email',
        'address_bn', 'address_en', 'village', 'country', 'occupation_bn', 'occupation_en',
        'member_type', 'monthly_pledge_amount', 'joining_date', 'is_active', 'is_public_profile', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'monthly_pledge_amount' => 'decimal:2',
            'joining_date' => 'date',
            'is_active' => 'boolean',
            'is_public_profile' => 'boolean',
        ];
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function monthlyDonations(): HasMany
    {
        return $this->hasMany(MonthlyDonation::class);
    }
}
