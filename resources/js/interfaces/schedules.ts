export interface ProfessionalScheduleResource {
    id: string;
    day_of_week: string;
    open_time: string;
    close_time: string;
    break_start_time: string;
    break_end_time: string;
    is_open: boolean;
    has_break: boolean;
}

export interface CompanyScheduleResource {
    id: string;
    day_of_week: string;
    open_time: string;
    close_time: string;
    break_start_time: string;
    break_end_time: string;
    is_open: boolean;
    has_break: boolean;
}

export type ProfessionalScheduleFormData = {
    day_of_week: string;
    open_time: string;
    close_time: string;
    break_start_time: string;
    break_end_time: string;
    is_open: boolean;
    has_break: boolean;
};

export interface CompanyScheduleObject {
    [key: string]: string;
}
