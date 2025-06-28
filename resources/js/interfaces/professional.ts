import { ServiceResource } from './service';
import { UserResource } from './user';

export interface ProfessionalResource {
    id: string;
    photo: string;
    bio: string;
    title: string;
    is_company_schedule: boolean;
    user: UserResource;
    exceptions: ExceptionResource[];
    services: ServiceResource[];
}

export type ProfessionalFormData = {
    photo: string;
    bio: string;
    title: string;
    is_company_schedule: boolean;
};

export interface ExceptionResource {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    reason: string;
}

export type ProfessionalServicesFormData = {
    services: string[];
};

export interface ProfessionalAvailability {
    professional: ProfessionalResource;
    service: ServiceResource;
    date: string;
    time_blocks: TimeBlock[];
}

export interface TimeBlock {
    morning: string[];
    afternoon: string[];
}
