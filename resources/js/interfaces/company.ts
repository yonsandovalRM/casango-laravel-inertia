export interface CompanyResource {
    id: string;
    name: string;
    email: string;
    tagline: string | null;
    description: string | null;
    logo: string | null;
    cover_image: string | null;
    currency: string;
    timezone: string;
    locale: string;
    allows_video_calls: boolean;
    schedules: CompanyScheduleResource[];
    schedule: Record<string, any>;
    grouped_schedule: Record<string, any>;
}

export interface CompanyScheduleResource {
    id: string;
    day_of_week: number;
    open_time: string;
    close_time: string;
    break_start_time: string | null;
    break_end_time: string | null;
    is_open: boolean;
    has_break: boolean;
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
