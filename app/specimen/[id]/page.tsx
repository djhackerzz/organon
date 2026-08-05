import { notFound } from 'next/navigation'
import { getSpecimenById } from '@/app/actions/specimens'
import { SpecimenPublicView } from '@/components/specimen-public-view'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const specimen = await getSpecimenById(id)
  if (!specimen) return {}
  return {
    title: `${specimen.name} — Anatomy Museum`,
    description: specimen.description,
  }
}

export default async function SpecimenPublicPage({ params }: Props) {
  const { id } = await params
  const specimen = await getSpecimenById(id)
  if (!specimen) notFound()
  return <SpecimenPublicView specimen={specimen} />
}
