<?php

namespace App\Models;

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
        'phone'
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

    public function userProfileData()
    {
        return $this->hasOne(UserProfileData::class);
    }

    /**
     * Relación con múltiples formularios de reserva
     */
    public function bookingFormData()
    {
        return $this->hasMany(BookingFormData::class);
    }

    /**
     * Obtener datos de formulario específico por template
     */
    public function getBookingFormDataByTemplate($templateId)
    {
        return $this->bookingFormData()->where('form_template_id', $templateId)->first();
    }

    /**
     * Verificar si tiene datos para un template específico
     */
    public function hasDataForTemplate($templateId): bool
    {
        return $this->bookingFormData()
            ->where('form_template_id', $templateId)
            ->whereNotNull('data')
            ->exists();
    }

    /**
     * Obtener templates activos con sus datos correspondientes
     */
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

    /**
     * Mutar fecha al guardar (convertir a UTC)
     */
    public function setDateAttribute($value)
    {
        if ($value) {
            $this->attributes['date'] = $this->fromCompanyTimezone($value)->format('Y-m-d');
        }
    }

    /**
     * Mutar datetime al guardar (convertir a UTC)
     */
    public function setCreatedAtAttribute($value)
    {
        if ($value) {
            $this->attributes['created_at'] = $this->fromCompanyTimezone($value);
        }
    }

    /**
     * Accessor para obtener fecha en timezone de compañía
     */
    public function getCompanyDateAttribute()
    {
        return $this->toCompanyTimezone('date')?->format('Y-m-d');
    }

    /**
     * Accessor para obtener datetime completo en timezone de compañía
     */
    public function getCompanyDateTimeAttribute()
    {
        if (!$this->date || !$this->time) {
            return null;
        }

        $dateTime = $this->date . ' ' . $this->time;
        return $this->toCompanyTimezone('created_at');
    }

    /**
     * Scope para obtener reservas de hoy (timezone compañía)
     */
    public function scopeToday($query)
    {
        $today = app(TimezoneService::class)->today()->format('Y-m-d');
        return $query->whereCompanyDate('date', '=', $today);
    }

    /**
     * Scope para obtener reservas de una fecha específica
     */
    public function scopeForDate($query, $date)
    {
        return $query->whereCompanyDate('date', '=', $date);
    }

    /**
     * Scope para obtener reservas en un rango de fechas
     */
    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetweenCompanyDates('date', $startDate, $endDate);
    }

    /**
     * Scope para incluir todos los datos de formularios
     */
    public function scopeWithAllFormData($query)
    {
        return $query->with([
            'bookingFormData.template.fields' => function ($query) {
                $query->orderBy('order');
            }
        ]);
    }

    /**
     * Scope para incluir solo formularios activos
     */
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
