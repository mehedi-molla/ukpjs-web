<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DonationSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'donor_name', 'phone', 'amount', 'fund_type', 'project_id', 'payment_method', 'reference_no',
        'notes', 'is_anonymous', 'status', 'reviewed_by', 'reviewed_at',
    ];

    protected function casts(): array
    {
        return ['amount' => 'decimal:2', 'is_anonymous' => 'boolean', 'reviewed_at' => 'datetime'];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
