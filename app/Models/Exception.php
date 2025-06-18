<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Exception extends Model
{
    use HasUuid;

    protected $fillable = ['professional_id', 'date', 'start_time', 'end_time', 'reason'];

    public function professional()
    {
        return $this->belongsTo(Professional::class);
    }
}
