<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Project extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'legacy_id', 'code', 'slug', 'title_bn', 'title_en', 'category', 'short_desc_bn', 'short_desc_en',
        'full_desc_bn', 'full_desc_en', 'featured_image', 'gallery_images', 'video_url', 'start_date',
        'estimated_end_date', 'actual_end_date', 'estimated_budget', 'status', 'location',
        'responsible_members', 'beneficiaries_count', 'beneficiary_info_bn', 'beneficiary_info_en',
        'is_published', 'is_featured', 'completion_outcome_bn', 'completion_outcome_en', 'is_demo',
    ];

    protected function casts(): array
    {
        return [
            'gallery_images' => 'array',
            'responsible_members' => 'array',
            'start_date' => 'date',
            'estimated_end_date' => 'date',
            'actual_end_date' => 'date',
            'estimated_budget' => 'decimal:2',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'is_demo' => 'boolean',
        ];
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function validIncomeTransactions(): HasMany
    {
        return $this->transactions()->where('type', 'income')->where('status', 'completed')->where('is_demo', false);
    }

    public function validExpenseTransactions(): HasMany
    {
        return $this->transactions()->where('type', 'expense')->where('status', 'completed')->where('is_demo', false);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('featured')->singleFile();
        $this->addMediaCollection('gallery');
    }
}
