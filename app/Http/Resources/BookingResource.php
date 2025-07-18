<?php

namespace App\Http\Resources;

use App\Enums\BookingDeliveryType;
use App\Services\TimezoneService;
use App\Services\VideoCallService;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
        $timezoneService = app(TimezoneService::class);
        $videoCallService = app(VideoCallService::class);

        $deliveryType = BookingDeliveryType::from($this->delivery_type);

        return [
            'id' => $this->id,
            'client' => UserResource::make($this->client)->toArray(request()),
            'professional' => ProfessionalResource::make($this->professional)->toArray(request()),
            'service' => ServiceResource::make($this->service)->toArray(request()),
            'price' => $this->price,
            'discount' => $this->discount,
            'total' => $this->total,
            'date' => $this->date,
            'time' => $this->time,
            'notes' => $this->notes,
            'status' => $this->status,
            'phone' => $this->phone,
            'payment_status' => $this->payment_status,
            'delivery_type' => $this->delivery_type,
            'delivery_type_label' => $deliveryType->label(),
            'delivery_type_icon' => $deliveryType->icon(),
            'requires_location' => $deliveryType->requiresLocation(),
            'requires_video_link' => $deliveryType->requiresVideoLink(),
            'video_call_link' => $this->video_call_link,
            'video_call_info' => $this->when(
                $this->video_call_link,
                fn() => $videoCallService->getVideoCallInfo($this->resource)
            ),
            'created_at' => $timezoneService->formatForFrontend($this->created_at),
            'updated_at' => $timezoneService->formatForFrontend($this->updated_at),
        ];
    }
}
