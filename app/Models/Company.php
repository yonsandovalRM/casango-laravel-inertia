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
        'tagline',
        'description',
        'logo',
        'cover_image',
        'currency',
        'timezone',
        'locale',
        'allows_video_calls',
    ];

    protected $casts = [
        'allows_video_calls' => 'boolean',
    ];

    public function schedules()
    {
        return $this->hasMany(CompanySchedule::class);
    }

    // Métodos helper para videollamadas
    public function supportsVideoCalls(): bool
    {
        return $this->allows_video_calls ?? false;
    }

    public function enableVideoCalls(): void
    {
        $this->update(['allows_video_calls' => true]);
    }

    public function disableVideoCalls(): void
    {
        $this->update(['allows_video_calls' => false]);
    }

    // Métodos existentes de horarios...
    public function getDailySchedulesArray(): array
    {
        // Código existente...
        $dayMap = [
            'monday'    => 'Lun.',
            'tuesday'   => 'Mar.',
            'wednesday' => 'Mié.',
            'thursday'  => 'Jue.',
            'friday'    => 'Vie.',
            'saturday'  => 'Sáb.',
            'sunday'    => 'Dom.'
        ];

        $weekDaysOrder = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday'
        ];

        $dailySchedules = [];

        foreach ($weekDaysOrder as $day) {
            $schedule = $this->schedules->firstWhere('day_of_week', $day);

            if ($schedule) {
                if (!$schedule->is_open) {
                    $dailySchedules[$dayMap[$day]] = 'Cerrado';
                    continue;
                }

                $openTime = date('H:i', strtotime($schedule->open_time));
                $closeTime = date('H:i', strtotime($schedule->close_time));
                $scheduleString = "{$openTime} a {$closeTime}";

                if ($schedule->has_break && $schedule->break_start_time && $schedule->break_end_time) {
                    $breakStart = date('H:i', strtotime($schedule->break_start_time));
                    $breakEnd = date('H:i', strtotime($schedule->break_end_time));
                    $scheduleString .= " (Break: {$breakStart} a {$breakEnd})";
                }

                $dailySchedules[$dayMap[$day]] = $scheduleString;
            } else {
                $dailySchedules[$dayMap[$day]] = 'Horario no definido';
            }
        }

        return $dailySchedules;
    }

    public function getGroupedSchedule(): array
    {
        // Código existente...
        $weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        $weekdaySchedules = collect($this->schedules)
            ->whereIn('day_of_week', $weekdays)
            ->filter(fn($s) => $s->is_open);

        $firstWeekday = $weekdaySchedules->first();

        $allSameWeekday = $weekdaySchedules->every(function ($s) use ($firstWeekday) {
            return $s->open_time === $firstWeekday->open_time &&
                $s->close_time === $firstWeekday->close_time &&
                $s->has_break === $firstWeekday->has_break &&
                $s->break_start_time === $firstWeekday->break_start_time &&
                $s->break_end_time === $firstWeekday->break_end_time;
        });

        $formatSchedule = function ($schedule) {
            $open = date('g:i A', strtotime($schedule->open_time));
            $close = date('g:i A', strtotime($schedule->close_time));
            $str = "$open - $close";

            if ($schedule->has_break && $schedule->break_start_time && $schedule->break_end_time) {
                $breakStart = date('g:i A', strtotime($schedule->break_start_time));
                $breakEnd = date('g:i A', strtotime($schedule->break_end_time));
                $str .= " (Break: $breakStart - $breakEnd)";
            }

            return $str;
        };

        $schedule = [];

        if ($allSameWeekday && $firstWeekday) {
            $schedule['weekdays'] = 'Lunes a Viernes: ' . $formatSchedule($firstWeekday);
        } else {
            $schedule['weekdays'] = 'Lunes a Viernes: Horario variable';
        }

        $sat = $this->schedules->firstWhere('day_of_week', 'saturday');
        if ($sat && $sat->is_open) {
            $schedule['saturday'] = 'Sábados: ' . $formatSchedule($sat);
        } else {
            $schedule['saturday'] = 'Sábados: Cerrado';
        }

        $sun = $this->schedules->firstWhere('day_of_week', 'sunday');
        if ($sun && $sun->is_open) {
            $schedule['sunday'] = 'Domingos: ' . $formatSchedule($sun);
        } else {
            $schedule['sunday'] = 'Domingos: Cerrado';
        }

        return $schedule;
    }
}
