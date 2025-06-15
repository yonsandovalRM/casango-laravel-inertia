export interface CompanyResource {
    id: string;
    name: string;
    email: string;
    phone: string;
    phone2: string;
    address: string;
    city: string;
    country: string;
    logo: string;
    cover_image: string;
    currency: string;
    timezone: string;
    language: string;
    schedules: Schedule[];
}

export interface Schedule {
    id: string;
    day_of_week: string;
    open_time: string;
    close_time: string;
    break_start_time: string;
    break_end_time: string;
}
