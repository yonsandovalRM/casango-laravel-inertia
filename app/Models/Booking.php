<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'client_id',
        'professional_id',
        'service_id',
        'price',
        'discount',
        'total',
        'date',
        'time',
        'status',
        'payment_status',
        'payment_method',
        'payment_id',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function professional()
    {
        return $this->belongsTo(Professional::class, 'professional_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function getTotalAttribute()
    {
        return $this->price - $this->discount;
    }
}
