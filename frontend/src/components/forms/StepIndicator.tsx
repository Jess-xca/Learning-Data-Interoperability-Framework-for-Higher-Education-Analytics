interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
}: StepIndicatorProps) {
  return (
    <header className="mb-10">
      <h3 className="text-3xl font-bold text-secondary tracking-tight">
        {stepTitle}
      </h3>
      <p className="text-on-surface-variant mt-2">
        Step {currentStep} of {totalSteps} • {stepDescription}
      </p>
    </header>
  );
}
