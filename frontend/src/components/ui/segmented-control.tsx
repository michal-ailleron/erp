import { useId } from 'react'

interface SegmentedControlProps<V extends string> {
  legend: string
  value: V
  options: readonly { value: V; label: string }[]
  onValueChange: (value: V) => void
}

/** Grupa przycisków radio: strzałki i fokus działają natywnie. */
export function SegmentedControl<V extends string>({ legend, value, options, onValueChange }: SegmentedControlProps<V>) {
  const name = useId()
  return (
    <fieldset className="inline-flex rounded-control border border-rule-soft bg-sheet p-1 shadow-sm">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className="relative">
          <input
            type="radio"
            name={name}
            className="peer sr-only"
            checked={value === option.value}
            onChange={() => onValueChange(option.value)}
          />
          <span className="block cursor-pointer rounded-lg px-3 py-1 transition-colors text-sm text-ink-soft peer-checked:bg-pen-soft peer-checked:font-medium peer-checked:text-pen peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pen">
            {option.label}
          </span>
        </label>
      ))}
    </fieldset>
  )
}
