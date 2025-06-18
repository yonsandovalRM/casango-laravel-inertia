import { UserResource } from './user';

export interface ProfessionalResource {
    id: string;
    photo: string;
    bio: string;
    title: string;
    is_full_time: boolean;
    user: UserResource;
    exceptions: ExceptionResource[];
}

export type ProfessionalFormData = {
    photo: string;
    bio: string;
    title: string;
    is_full_time: boolean;
};

export interface ExceptionResource {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    reason: string;
}
