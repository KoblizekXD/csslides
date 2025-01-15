"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const data = {
    email: formData.email as string,
    password: formData.password as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  
  if (error) {
    return error.message;
  }

  revalidatePath("/", "layout");
  redirect("/app");
}

export async function signup(formData: { username: string; email: string; password: string }) {
  const supabase = await createClient();

  const data = {
    email: formData.email as string,
    password: formData.password as string,
    options: {
      data: {
        username: formData.username as string,
      }
    }
  };

  const resp = await supabase.auth.signUp(data);
  

  if (resp.error) {
    return resp.error.message;
  }

  revalidatePath("/", "layout");
  redirect("/app");
}
