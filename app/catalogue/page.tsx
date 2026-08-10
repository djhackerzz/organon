import { getPublicSpecimens } from '@/app/actions/specimens'
import { SpecimenCatalogueView } from '@/components/specimen-catalogue-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catalogue',
  description:
    'Browse the complete collection of preserved anatomical specimens in the museum — every plate, numbered and indexed.',
}

export const dynamic = 'force-dynamic'

export default async function CataloguePage() {
  const specimens = await getPublicSpecimens()
  return <SpecimenCatalogueView specimens={specimens} />
}
