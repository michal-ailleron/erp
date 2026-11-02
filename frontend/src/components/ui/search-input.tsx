import { Search } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

interface SearchInputProps {
  /** Current value from the URL. */
  value: string
  /** Called only after a short pause in typing, so the API is not queried on every letter. */
  onDebouncedChange: (value: string) => void
  label: string
  placeholder?: string
}

export function SearchInput({ value, onDebouncedChange, label, placeholder }: SearchInputProps) {
  const id = useId()
  const [text, setText] = useState(value)
  const [previousValue, setPreviousValue] = useState(value)

  // An external change (e.g. the "back" button) updates the field.
  if (value !== previousValue) {
    setPreviousValue(value)
    setText(value)
  }

  useEffect(() => {
    if (text === value) return
    const timer = setTimeout(() => onDebouncedChange(text), 300)
    return () => clearTimeout(timer)
  }, [text, value, onDebouncedChange])

  return (
    <div className="relative w-full sm:w-72">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
      <input
        id={id}
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-control border border-rule-soft bg-sheet pr-3 pl-9 shadow-sm transition-shadow focus:border-pen focus:shadow-pop focus:outline-none text-sm text-ink placeholder:text-ink-faint"
      />
    </div>
  )
}
