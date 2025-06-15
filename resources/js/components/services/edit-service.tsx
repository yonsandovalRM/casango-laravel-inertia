import { ServiceFormData, ServiceResource } from '@/interfaces/service';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { FormService } from './form-service';

interface EditServiceProps {
    service: ServiceResource;
}

export function EditService({ service }: EditServiceProps) {
    const { data, setData, put, errors, processing } = useForm<ServiceFormData>({
        name: service.name,
        description: service.description,
        notes: service.notes,
        category: service.category,
        price: service.price,
        duration: service.duration,
        preparation_time: service.preparation_time,
        post_service_time: service.post_service_time,
        is_active: service.is_active,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('services.update', service.id));
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <FormService data={data} setData={setData} errors={errors} />
                <Button type="submit" disabled={processing}>
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update'}
                </Button>
            </form>
        </div>
    );
}
