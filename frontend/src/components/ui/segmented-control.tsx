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
    <fieldset className="inline-flex rounded-control border border-rule bg-sheet p-0.5">
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
          <span className="block cursor-pointer rounded-[2px] px-3 py-1.5 text-sm text-ink-soft peer-checked:bg-ink peer-checked:text-sheet peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pen">
            {option.label}
          </span>
        </label>
      ))}
    </fieldset>
  )
}
