<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenantCategory extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = ['name', 'is_active', 'description'];

    public function tenants()
    {
        return $this->hasMany(Tenant::class);
    }
}
