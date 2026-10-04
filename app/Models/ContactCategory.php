<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContactCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'legacy_id', 'slug', 'name_bn', 'name_en', 'icon', 'sort_order', 'is_active', 'is_core',
        'is_emergency_service', 'is_home_featured', 'description_bn', 'description_en',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean', 'is_core' => 'boolean',
            'is_emergency_service' => 'boolean', 'is_home_featured' => 'boolean',
        ];
    }

    public function scopeEmergencyServices(Builder $query): Builder
    {
        return $query->where('is_active', true)->where('is_emergency_service', true)->orderBy('sort_order');
    }

    /** URL segment for /emergency/{category}; slugs are stored with underscores. */
    public function emergencyUrlSlug(): string
    {
        return str_replace('_', '-', $this->slug);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'category_id');
    }
}
