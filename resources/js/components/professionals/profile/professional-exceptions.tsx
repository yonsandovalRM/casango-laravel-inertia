import { ExceptionResource } from '@/interfaces/professional';

export function ProfessionalExceptions({ exceptions }: { exceptions: ExceptionResource[] }) {
    console.log(exceptions);

    return <div>ProfessionalExceptions</div>;
}
