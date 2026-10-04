<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContactCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'legacy_id', 'slug', 'name_bn', 'name_en', 'icon', 'sort_order', 'is_active', 'is_core',
        'description_bn', 'description_en',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'is_core' => 'boolean'];
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'category_id');
    }
}
