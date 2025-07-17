<?php

namespace App\Models;

use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;

    protected $fillable = [
        'id',
        'name',
        'tenant_category_id',
        'email',
        'plan_id',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];


    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'email',
            'tenant_category_id',
            'plan_id',
        ];
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function tenantCategory()
    {
        return $this->belongsTo(TenantCategory::class);
    }
}
