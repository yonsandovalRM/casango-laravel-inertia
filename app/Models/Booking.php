<?php

namespace App\Models;

use App\Traits\HasTimezone;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory, HasUuid, HasTimezone;

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
    ];

    /**
     * Campos específicos de timezone para Booking
     */
    protected $timezoneFields = [
        'created_at',
        'updated_at',
        'date',
        'time'
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime',
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

    /**
     * Scope para obtener reservas de una fecha específica en timezone de empresa
     */
    public function scopeForDate($query, $date)
    {
        return $this->scopeWhereDateEqualsInTimezone($query, 'date', $date);
    }

    /**
     * Scope para reservas de hoy
     */
    public function scopeTodayBookings($query)
    {
        return $this->scopeToday($query, 'date');
    }

    /**
     * Obtener fecha y hora formateada para mostrar
     */
    public function getFormattedDateTimeAttribute(): string
    {
        return $this->formatForFrontend('date', 'Y-m-d') . ' ' . $this->formatForFrontend('time', 'H:i');
    }
}
