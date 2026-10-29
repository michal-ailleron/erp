import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Łączy klasy Tailwinda i rozwiązuje konflikty (ostatnia wygrywa). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Parametry z adresu URL są tekstem od użytkownika: przepuszczamy tylko znane wartości. */
export function parseOneOf<T extends string>(value: string, allowed: readonly T[]): T | '' {
  return (allowed as readonly string[]).includes(value) ? (value as T) : ''
}
