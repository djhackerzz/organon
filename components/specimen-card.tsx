'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SpecimenForm } from '@/components/specimen-form'
import { deleteSpecimen } from '@/app/actions/specimens'
import type { Specimen } from '@/lib/db/schema'
import { QrCode, Pencil, Trash2, ExternalLink } from 'lucide-react'

interface SpecimenCardProps {
  specimen: Specimen
  baseUrl: string
}

export function SpecimenCard({ specimen, baseUrl }: SpecimenCardProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const publicUrl = `${baseUrl}/specimen/${specimen.id}`

  const handleDelete = async () => {
    setDeleting(true)
    await deleteSpecimen(specimen.id)
    setDeleting(false)
    setDeleteOpen(false)
    router.refresh()
  }

  return (
    <>
      <Card className="flex flex-col gap-3 rounded-sm p-4">
        {(specimen.specimenPhotoUrl || specimen.imageUrl) && (
          <div className="h-32 overflow-hidden rounded-sm bg-muted">
            <img
              src={specimen.specimenPhotoUrl ?? specimen.imageUrl ?? ''}
              alt={specimen.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-sans text-[0.6rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {specimen.specimenNumber}
            </p>
            <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
              {specimen.name}
            </h3>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {specimen.systemCategory.split(' ')[0]}
          </Badge>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {specimen.description}
        </p>

        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <Link href={`/admin/qr/${specimen.id}`} className="flex-1 min-w-0">
            <Button variant="outline" size="sm" className="w-full gap-1.5">
              <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
              QR Code
            </Button>
          </Link>
          <Link href={publicUrl} target="_blank" className="flex-1 min-w-0">
            <Button variant="outline" size="sm" className="w-full gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="text-muted-foreground"
            aria-label={`Edit ${specimen.name}`}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="text-destructive hover:text-destructive"
            aria-label={`Delete ${specimen.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </Card>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl flex flex-col max-h-[90vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle>Edit Specimen</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-6 pb-6 flex-1">
            <SpecimenForm
              specimen={specimen}
              onSuccess={() => setEditOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete specimen?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{specimen.name}</strong> (
              {specimen.specimenNumber}) and its QR code will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
