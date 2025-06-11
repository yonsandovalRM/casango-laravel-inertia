import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './alert-dialog';

export const DialogConfirm = ({
	title,
	description,
	onConfirm,
	onCancel,
	children,
	variant,
}: {
	title: string;
	description: string;
	onConfirm: () => void;
	onCancel: () => void;
	children: React.ReactNode;
	variant: 'destructive' | 'default';
}) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>
						{variant === 'destructive' ? 'Eliminar' : 'Confirmar'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
