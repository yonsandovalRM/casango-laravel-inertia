import { CompanyFormData, CompanyResource } from '@/interfaces/company';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const useCompanyForm = (company?: CompanyResource) => {
    const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo ? `/storage/${company.logo}` : null);
    const [coverPreview, setCoverPreview] = useState<string | null>(company?.cover_image ? `/storage/${company.cover_image}` : null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const initialSchedules = DAYS_OF_WEEK.map((day) => {
        const existingSchedule = company?.schedules?.find((s) => s.day_of_week === day);
        return (
            existingSchedule || {
                day_of_week: day,
                open_time: '09:00',
                close_time: '18:00',
                break_start_time: '12:00',
                break_end_time: '13:00',
                is_open: true,
                has_break: false,
            }
        );
    });

    const form = useForm<CompanyFormData>({
        id: company?.id || '',
        name: company?.name || '',
        email: company?.email || '',
        tagline: company?.tagline || '',
        description: company?.description || '',
        currency: company?.currency || 'CLP',
        timezone: company?.timezone || 'America/Santiago',
        locale: company?.locale || 'es-CL',
        logo: null,
        cover_image: null,
        schedules: initialSchedules,
    });

    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            if (coverPreview) URL.revokeObjectURL(coverPreview);
        };
    }, [logoPreview, coverPreview]);

    const handleImageUpload = (type: 'logo' | 'cover', file: File | null) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (type === 'logo') {
                setLogoPreview(previewUrl);
                form.setData('logo', file);
            } else {
                setCoverPreview(previewUrl);
                form.setData('cover_image', file);
            }
        }
    };

    const removeImage = (type: 'logo' | 'cover') => {
        if (type === 'logo') {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            setLogoPreview(null);
            form.setData('logo', null);
            if (logoInputRef.current) logoInputRef.current.value = '';
        } else {
            if (coverPreview) URL.revokeObjectURL(coverPreview);
            setCoverPreview(null);
            form.setData('cover_image', null);
            if (coverInputRef.current) coverInputRef.current.value = '';
        }
    };

    const handleScheduleChange = (dayOfWeek: string, field: string, value: any) => {
        const updatedSchedules = form.data.schedules.map((schedule) => {
            if (schedule.day_of_week === dayOfWeek) {
                const updatedSchedule = { ...schedule, [field]: value };

                // Clear break times if break is disabled
                if (field === 'has_break' && !value) {
                    updatedSchedule.break_start_time = '';
                    updatedSchedule.break_end_time = '';
                }

                return updatedSchedule;
            }
            return schedule;
        });

        form.setData('schedules', updatedSchedules);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('company.update', { _method: 'PUT' }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Empresa actualizada exitosamente');
            },
        });
    };

    return {
        form,
        logoPreview,
        coverPreview,
        logoInputRef,
        coverInputRef,
        handleImageUpload,
        removeImage,
        handleScheduleChange,
        handleSubmit,
    };
};
