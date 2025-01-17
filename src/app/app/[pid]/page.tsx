import { getPresentation } from "@/lib/supabase/actions";
import App from "./app";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ pid: string }>
}) {

  const presentation = await getPresentation((await params).pid);

  if (typeof presentation === "string") {
    console.log(presentation);
    redirect("/app/recent");
  } else return <App presentation={presentation} />;
}
