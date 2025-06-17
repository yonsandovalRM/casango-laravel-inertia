import { UserResource } from './user';

export interface ProfessionalResource {
    id: string;
    photo: string;
    bio: string;
    title: string;
    is_full_time: boolean;
    user: UserResource;
}

export type ProfessionalFormData = {
    photo: string;
    bio: string;
    title: string;
    is_full_time: boolean;
};
