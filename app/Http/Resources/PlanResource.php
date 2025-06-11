<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'price_monthly' => $this->price_monthly,
            'price_annual' => $this->price_annual,
            'currency' => $this->currency,
            'features' => $this->features,
            'is_free' => $this->is_free,
            'is_popular' => $this->is_popular,
            'trial_days' => $this->trial_days,
        ];
    }
}
