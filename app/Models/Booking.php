<?php

namespace App\Models;

use App\Enums\BookingDeliveryType;
use App\Services\TimezoneService;
use App\Traits\HasCompanyTimezone;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory, HasUuid, HasCompanyTimezone;

    protected $fillable = [
        'client_id',
        'professional_id',
        'service_id',
        'price',
        'discount',
        'total',
        'date',
        'time',
        'notes',
        'status',
        'payment_status',
        'payment_method',
        'payment_id',
        'phone',
        'delivery_type',
        'video_call_link',
        'video_call_metadata',
    ];

    protected $casts = [
        'delivery_type' => BookingDeliveryType::class,
        'video_call_metadata' => 'array',
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

    public function userProfileData()
    {
        return $this->hasOne(UserProfileData::class);
    }

    public function bookingFormData()
    {
        return $this->hasMany(BookingFormData::class);
    }

    // Métodos helper para videollamadas
    public function isVideoCall(): bool
    {
        return $this->delivery_type === BookingDeliveryType::VIDEO_CALL;
    }

    public function isInPerson(): bool
    {
        return $this->delivery_type === BookingDeliveryType::IN_PERSON;
    }

    public function hasVideoCallLink(): bool
    {
        return !empty($this->video_call_link);
    }

    public function getVideoCallPlatform(): ?string
    {
        if (!$this->hasVideoCallLink()) {
            return null;
        }

        if (str_contains($this->video_call_link, 'meet.jit.si')) return 'jitsi';
        if (str_contains($this->video_call_link, 'zoom.us')) return 'zoom';
        if (str_contains($this->video_call_link, 'meet.google.com')) return 'google_meet';
        if (str_contains($this->video_call_link, 'teams.microsoft.com')) return 'teams';

        return 'other';
    }

    // Scopes
    public function scopeVideoCall($query)
    {
        return $query->where('delivery_type', BookingDeliveryType::VIDEO_CALL->value);
    }

    public function scopeInPerson($query)
    {
        return $query->where('delivery_type', BookingDeliveryType::IN_PERSON->value);
    }

    public function scopeWithVideoCallLink($query)
    {
        return $query->whereNotNull('video_call_link');
    }

    // Accessors y Mutators existentes...
    public function getTotalAttribute()
    {
        return $this->price - $this->discount;
    }

    public function getBookingFormDataByTemplate($templateId)
    {
        return $this->bookingFormData()->where('form_template_id', $templateId)->first();
    }

    public function hasDataForTemplate($templateId): bool
    {
        return $this->bookingFormData()
            ->where('form_template_id', $templateId)
            ->whereNotNull('data')
            ->exists();
    }

    public function getActiveBookingFormsWithData()
    {
        $activeTemplates = FormTemplate::bookingForm()
            ->active()
            ->with(['fields' => function ($query) {
                $query->orderBy('order');
            }])
            ->get();

        return $activeTemplates->map(function ($template) {
            $formData = $this->getBookingFormDataByTemplate($template->id);

            return [
                'template' => $template,
                'data' => $formData,
                'has_data' => (bool) $formData
            ];
        });
    }

    // Timezone methods...
    public function setDateAttribute($value)
    {
        if ($value) {
            $this->attributes['date'] = $this->fromCompanyTimezone($value)->format('Y-m-d');
        }
    }

    public function setCreatedAtAttribute($value)
    {
        if ($value) {
            $this->attributes['created_at'] = $this->fromCompanyTimezone($value);
        }
    }

    public function getCompanyDateAttribute()
    {
        return $this->toCompanyTimezone('date')?->format('Y-m-d');
    }

    public function getCompanyDateTimeAttribute()
    {
        if (!$this->date || !$this->time) {
            return null;
        }

        $dateTime = $this->date . ' ' . $this->time;
        return $this->toCompanyTimezone('created_at');
    }

    public function scopeToday($query)
    {
        $today = app(TimezoneService::class)->today()->format('Y-m-d');
        return $query->whereCompanyDate('date', '=', $today);
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereCompanyDate('date', '=', $date);
    }

    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetweenCompanyDates('date', $startDate, $endDate);
    }

    public function scopeWithAllFormData($query)
    {
        return $query->with([
            'bookingFormData.template.fields' => function ($query) {
                $query->orderBy('order');
            }
        ]);
    }

    public function scopeWithActiveFormData($query)
    {
        return $query->with([
            'bookingFormData' => function ($query) {
                $query->whereHas('template', function ($templateQuery) {
                    $templateQuery->where('is_active', true);
                });
            },
            'bookingFormData.template.fields' => function ($query) {
                $query->orderBy('order');
            }
        ]);
    }
}
