import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-pen text-white hover:bg-pen-dark',
        secondary: 'border border-rule bg-sheet text-ink hover:bg-rule-soft',
        ghost: 'text-ink-soft hover:bg-rule-soft hover:text-ink',
      },
      size: {
        md: 'h-9 px-3.5 text-sm',
        sm: 'h-8 px-2.5 text-sm',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
