import { clsx } from 'clsx'
import { Check } from 'lucide-react'

interface StepperProps {
  currentStep: number
  steps: string[]
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm',
                index < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStep
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'bg-secondary text-secondary-foreground'
              )}
            >
              {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
            </div>

            {index < steps.length - 1 && (
              <div
                className={clsx(
                  'flex-1 h-1 mx-2',
                  index < currentStep ? 'bg-primary' : 'bg-secondary'
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        {steps.map((step) => (
          <span key={step} className="text-xs">{step}</span>
        ))}
      </div>
    </div>
  )
}
