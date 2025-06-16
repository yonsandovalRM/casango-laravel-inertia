<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{

    use HasFactory, HasUuid;

    protected $fillable = ['name', 'is_active'];

    public function services()
    {
        return $this->hasMany(Service::class);
    }
}
