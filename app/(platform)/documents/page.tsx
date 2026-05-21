"use client"
import { useState } from "react"
import { DocumentGallery } from "@/components/documents/document-gallery"
import { DocumentEditor } from "@/components/documents/document-editor"

export default function DocumentsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (selectedId) {
    return <DocumentEditor docId={selectedId} onBack={() => setSelectedId(null)} />
  }

  return <DocumentGallery onSelect={setSelectedId} />
}
