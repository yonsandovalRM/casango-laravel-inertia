export interface CompanyResource {
    id: string;
    name: string;
    email: string;
    tagline: string;
    description: string;
    logo: string | File | null;
    cover_image: string | File | null;
    currency: string;
    timezone: string;
    locale: string;
    schedules: Schedule[];
    schedule: {
        weekdays: string;
        saturday: string;
        sunday: string;
    };
    allows_video_calls: boolean;
    created_at: string;
    updated_at: string;
}

export type CompanyFormData = {
    id: string;
    name: string;
    email: string;
    tagline: string;
    description: string;
    currency: string;
    timezone: string;
    locale: string;
    logo: File | null;
    cover_image: File | null;
    schedules: ScheduleFormData[];
};

export type ScheduleFormData = {
    day_of_week: string;
    open_time: string;
    close_time: string;
    break_start_time: string;
    break_end_time: string;
    is_open: boolean;
    has_break: boolean;
};
export interface Schedule {
    id: string;
    day_of_week: string;
    open_time: string;
    close_time: string;
    break_start_time: string;
    break_end_time: string;
    is_open: boolean;
    has_break: boolean;
}

export interface CompanyApiResponse {
    company: CompanyResource;
    allows_video_calls: boolean;
    schedules: Schedule[];
}

export interface OpenStatusResponse {
    is_open: boolean;
    datetime: string;
}

export interface ScheduleForDayResponse extends Schedule {
    // Extending base schedule with any additional properties
}
