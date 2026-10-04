<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WelfareRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'legacy_id', 'tracking_no', 'applicant_name', 'guardian_name', 'phone', 'village', 'assistance_type',
        'description', 'requested_amount', 'approved_amount', 'status', 'verification_notes', 'disbursed_date',
        'created_by', 'reviewed_by',
    ];

    protected function casts(): array
    {
        return [
            'requested_amount' => 'decimal:2',
            'approved_amount' => 'decimal:2',
            'disbursed_date' => 'date',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
