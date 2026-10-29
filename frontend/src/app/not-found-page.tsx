import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'

export function NotFoundPage() {
  return (
    <>
      <PageHeader title="Nie ma takiej strony" description="Adres może być nieaktualny albo wpisany z błędem." />
      <Link to="/" className={buttonVariants({ variant: 'primary' })}>
        Wróć na pulpit
      </Link>
    </>
  )
}
