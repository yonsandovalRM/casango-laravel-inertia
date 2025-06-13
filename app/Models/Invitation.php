<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    use HasUuid;

    protected $fillable = ['email', 'name', 'role', 'token', 'expires_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
