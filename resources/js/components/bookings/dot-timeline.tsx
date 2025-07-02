import { Calendar } from 'lucide-react';

import { BookingResource } from '@/interfaces/booking';
import { cn } from '@/lib/utils';
export default function DotTimeline({ booking }: { booking: BookingResource }) {
    return (
        <div
            className={cn('relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-lg', {
                'border-green-200 bg-green-500': booking.status === 'confirmed',
                'border-yellow-200 bg-yellow-500': booking.status === 'pending',
                'border-red-200 bg-red-500': booking.status === 'cancelled',
            })}
        >
            <Calendar className="h-6 w-6 text-white" />
        </div>
    );
}
