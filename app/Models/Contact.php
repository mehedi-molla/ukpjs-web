<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Contact extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'legacy_id', 'category_id', 'name_bn', 'name_en', 'designation_bn', 'designation_en', 'union_name',
        'ward', 'area', 'phone', 'alt_phone', 'whatsapp', 'address_bn', 'address_en', 'description_bn',
        'description_en', 'photo_path', 'vehicle_photo_path', 'service_area', 'availability', 'is_emergency',
        'is_verified', 'last_verified_at', 'is_published', 'is_featured', 'sort_order', 'is_demo', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_emergency' => 'boolean',
            'is_verified' => 'boolean',
            'last_verified_at' => 'date',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'is_demo' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ContactCategory::class, 'category_id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('portrait')->singleFile();
        $this->addMediaCollection('vehicle')->singleFile();
    }
}
