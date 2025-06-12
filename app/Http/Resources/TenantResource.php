<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TenantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // detectar prod o dev
        $isDev = config('app.env') === 'local';
        $domain = $this->domains->first()?->domain;
        $url = $isDev ? 'http://' . $domain : 'https://' . $domain;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'category' => $this->category,
            'subscription' => new SubscriptionResource($this->subscriptions()->first())->toArray(request()),
            'data' => $this->data,
            'domain' => $domain,
            'url' => $url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
