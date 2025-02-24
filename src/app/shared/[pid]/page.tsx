import { getPresentation } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import { SharedPresentationPreview } from "./shared";

export default async function SharedPresentation({
  params,
}: {
  params: Promise<{ pid: string }>;
}) {
  const pid = (await params).pid;
  console.log(pid);

  const presentation = await getPresentation(pid, false);

  if (typeof presentation === "string")
    return redirect(`/?error=${encodeURIComponent(presentation)}`);
  if (!presentation.shared)
    return redirect(`/?error=${encodeURIComponent("Presentation not shared")}`);

  return <SharedPresentationPreview presentation={presentation} />;
}
