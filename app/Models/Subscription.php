<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasUuid;
    
    protected $fillable = [
        'tenant_id',
        'plan_id',
        'price',
        'currency',
        'trial_ends_at',
        'ends_at',
        'payment_status',
        'is_monthly',
        'is_active',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}

