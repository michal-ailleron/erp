import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 motion-reduce:active:scale-100',
  {
    variants: {
      variant: {
        primary: 'bg-linear-to-b from-pen to-pen-dark text-white shadow-sm hover:shadow-pop hover:brightness-110 dark:text-paper',
        secondary: 'border border-rule-soft bg-sheet text-ink shadow-sm hover:border-rule hover:bg-paper',
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
