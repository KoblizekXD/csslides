import { getPresentation } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import App from "./app";

export default async function Page({
  params,
}: {
  params: Promise<{ pid: string }>;
}) {
  const presentation = await getPresentation((await params).pid);

  if (typeof presentation === "string") {
    redirect("/app/recent");
  } else return <App presentation={presentation} />;
}
