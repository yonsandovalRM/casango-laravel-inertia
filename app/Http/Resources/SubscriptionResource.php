<?php

namespace App\Http\Resources;

use App\Traits\TimezoneResourceTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    use TimezoneResourceTrait;

    protected $timezoneFields = [
        'trial_ends_at',
        'ends_at',
        'created_at',
        'updated_at',
    ];

    public function toArray($request)
    {

        return [
            'id' => $this->id,
            'tenant_id' => $this->tenant_id,
            'plan_id' => $this->plan_id,
            'price' => $this->price,
            'currency' => $this->currency,
            'is_monthly' => $this->is_monthly,
            'is_active' => $this->is_active,
            'payment_status' => $this->payment_status,


            // Fechas
            'trial_ends_at' => $this->trial_ends_at,
            'ends_at' => $this->ends_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,


            // MercadoPago
            'mp_preapproval_id' => $this->mp_preapproval_id,
            'mp_init_point' => $this->mp_init_point,


            // Relaciones
            'plan' => $this->plan ?  PlanResource::make($this->whenLoaded('plan'))->toArray(request()) : null,
            'tenant' => $this->when(
                $this->relationLoaded('tenant'),
                function () {
                    return [
                        'id' => $this->tenant->id,
                        'name' => $this->tenant->name,
                        'email' => $this->tenant->email,
                    ];
                }
            ),


        ];
    }
}
