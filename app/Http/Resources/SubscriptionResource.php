<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {


        return [
            'id' => $this->id,
            'tenant_id' => $this->tenant_id,
            'plan' => new PlanResource($this->plan)->toArray(request()),
            'price' => $this->price,
            'currency' => $this->currency,
            'trial_ends_at' => $this->trial_ends_at,
            'ends_at' => $this->ends_at,
            'payment_status' => $this->payment_status,
            'is_monthly' => $this->is_monthly,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
