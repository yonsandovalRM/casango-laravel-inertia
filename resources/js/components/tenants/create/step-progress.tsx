interface Step {
    number: number;
    title: string;
    description: string;
}

interface StepProgressProps {
    steps: Step[];
    currentStep: number;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
    return (
        <div className="w-full">
            <div className="mb-8 flex items-center justify-center">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                                    step.number <= currentStep ? 'bg-blue-600 text-foreground shadow-lg' : 'bg-accent text-muted-foreground'
                                }`}
                            >
                                {step.number}
                            </div>
                            <div className="mt-2 text-center">
                                <p
                                    className={`text-xs font-medium transition-colors duration-300 ${
                                        step.number <= currentStep ? 'text-blue-600' : 'text-foreground'
                                    }`}
                                >
                                    {step.title}
                                </p>
                                <p className="mt-1 hidden text-xs text-muted-foreground sm:block">{step.description}</p>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`mx-4 h-0.5 w-16 transition-colors duration-300 ${step.number < currentStep ? 'bg-blue-600' : 'bg-muted'}`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
