import { Schedule } from '@/interfaces/company';

export const formatScheduleDisplay = (schedule: Schedule, t: any) => {
    if (!schedule.is_open) {
        return t('company.form.closed');
    }

    let display = `${formatTime(schedule.open_time)} - ${formatTime(schedule.close_time)}`;

    if (schedule.has_break && schedule.break_start_time && schedule.break_end_time) {
        display += ` (${t('company.form.break')}: ${formatTime(schedule.break_start_time)} - ${formatTime(schedule.break_end_time)})`;
    }

    return display;
};

export const formatTime = (time: string) => {
    if (!time) return '--:--';

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const hours12 = hours % 12 || 12;
    const formattedHours = hours12.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}${period}`;
};

export const validateSchedule = (schedule: Schedule): string[] => {
    const errors: string[] = [];

    if (schedule.is_open) {
        if (!schedule.open_time) {
            errors.push('Open time is required');
        }
        if (!schedule.close_time) {
            errors.push('Close time is required');
        }
        if (schedule.open_time && schedule.close_time && schedule.open_time >= schedule.close_time) {
            errors.push('Close time must be after open time');
        }

        if (schedule.has_break) {
            if (!schedule.break_start_time) {
                errors.push('Break start time is required');
            }
            if (!schedule.break_end_time) {
                errors.push('Break end time is required');
            }
            if (schedule.break_start_time && schedule.break_end_time && schedule.break_start_time >= schedule.break_end_time) {
                errors.push('Break end time must be after break start time');
            }
            if (schedule.break_start_time && schedule.open_time && schedule.break_start_time < schedule.open_time) {
                errors.push('Break start time must be after open time');
            }
            if (schedule.break_end_time && schedule.close_time && schedule.break_end_time > schedule.close_time) {
                errors.push('Break end time must be before close time');
            }
        }
    }

    return errors;
};
