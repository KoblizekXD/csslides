import { createClient } from "@/lib/supabase/server";
import { RecentPage } from "./recent";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user || user.error) {
    redirect("/login");
  }

  return <RecentPage user={user.data.user} />;
}
