<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{

    use HasFactory, HasUuid;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'phone2',
        'address',
        'city',
        'country',
        'logo',
        'cover_image',
        'currency',
        'timezone',
        'locale',
    ];



    public function schedules()
    {
        return $this->hasMany(CompanySchedule::class);
    }

    // En el modelo Company
    public function getDailySchedulesArray(): array
    {
        // Mapeo de días en inglés a español (abreviados)
        $dayMap = [
            'monday'    => 'Lun.',
            'tuesday'   => 'Mar.',
            'wednesday' => 'Mié.',
            'thursday'  => 'Jue.',
            'friday'    => 'Vie.',
            'saturday'  => 'Sáb.',
            'sunday'    => 'Dom.'
        ];

        // Orden de días de la semana
        $weekDaysOrder = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday'
        ];

        // Preparamos el array de resultados
        $dailySchedules = [];

        // Recorremos todos los días de la semana en orden
        foreach ($weekDaysOrder as $day) {
            // Buscamos el horario para este día
            $schedule = $this->schedules->firstWhere('day_of_week', $day);

            if ($schedule) {
                if (!$schedule->is_open) {
                    $dailySchedules[$dayMap[$day]] = 'Cerrado';
                    continue;
                }

                // Formatear horas
                $openTime = date('H:i', strtotime($schedule->open_time));
                $closeTime = date('H:i', strtotime($schedule->close_time));

                $scheduleString = "{$openTime} a {$closeTime}";

                // Agregar break si existe
                if ($schedule->has_break && $schedule->break_start_time && $schedule->break_end_time) {
                    $breakStart = date('H:i', strtotime($schedule->break_start_time));
                    $breakEnd = date('H:i', strtotime($schedule->break_end_time));
                    $scheduleString .= " (Break: {$breakStart} a {$breakEnd})";
                }

                $dailySchedules[$dayMap[$day]] = $scheduleString;
            } else {
                // Si no existe registro para este día, marcamos como no disponible
                $dailySchedules[$dayMap[$day]] = 'Horario no definido';
            }
        }

        return $dailySchedules;
    }
}
