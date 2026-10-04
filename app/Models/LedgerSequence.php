<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LedgerSequence extends Model
{
    protected $fillable = ['year', 'last_sequence'];

    protected function casts(): array
    {
        return ['year' => 'integer', 'last_sequence' => 'integer'];
    }
}
