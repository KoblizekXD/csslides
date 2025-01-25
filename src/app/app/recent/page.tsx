import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RecentPage } from "./recent";

export default async function Page() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user || user.error) {
    redirect("/login");
  }

  return <RecentPage user={user.data.user} />;
}
