import { useId, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string
  options: readonly { value: string; label: string }[]
  onValueChange: (value: string) => void
}

/** Natywny <select>: dostępny z klawiatury i na telefonie bez dodatkowej pracy. */
export function SelectField({ label, options, onValueChange, className, ...props }: SelectFieldProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn('h-9 rounded-control border border-rule-soft bg-sheet px-2.5 text-sm text-ink shadow-sm', className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
