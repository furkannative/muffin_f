import { ProjectDetailPage } from "@/components/project-detail-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Project Detail - Cursor for Hiring",
  description: "View and manage project applications",
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  return <ProjectDetailPage projectId={params.id} />
}
