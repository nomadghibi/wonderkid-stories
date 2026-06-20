import { redirect } from "next/navigation";

// Review is integrated into the reader — redirect there
export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard/books/${id}/reader`);
}
