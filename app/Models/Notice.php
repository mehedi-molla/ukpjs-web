<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notice extends Model
{
    use HasFactory;

    protected $fillable = [
        'legacy_id', 'title_bn', 'title_en', 'content_bn', 'content_en', 'publish_date', 'is_pinned',
        'is_active', 'created_by',
    ];

    protected function casts(): array
    {
        return ['publish_date' => 'date', 'is_pinned' => 'boolean', 'is_active' => 'boolean'];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
