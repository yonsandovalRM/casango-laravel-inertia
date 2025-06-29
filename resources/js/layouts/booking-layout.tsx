import BookingFooter from './booking/footer';
import BookingHeader from './booking/header';

export default function BookingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-sidebar">
            <BookingHeader />
            {children}
            <BookingFooter />
        </div>
    );
}
