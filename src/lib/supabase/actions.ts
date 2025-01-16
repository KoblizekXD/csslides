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

export async function signup(formData: {
  username: string;
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  const data = {
    email: formData.email as string,
    password: formData.password as string,
    options: {
      data: {
        username: formData.username as string,
      },
    },
  };

  const resp = await supabase.auth.signUp(data);

  if (resp.error) {
    return resp.error.message;
  }

  revalidatePath("/", "layout");
  redirect("/app");
}

export interface Slide {
  id: number;
  created_at: string;
  html: string;
  css: string;
  name: string;
}

export interface Presentation {
  id: number;
  created_at: string;
  user_id: string;
  path_id: string;
  name: string;
  description: string;
  slides: Slide[];
}

export type PresentationPreview = Omit<Presentation, "slides">;

export async function createPresentation(
  presentation: Presentation
): Promise<string | undefined> {
  const supabase = await createClient();

  console.log(
    "Creating presentation with",
    presentation.slides.length,
    "default slides"
  );

  let res = await supabase.from("presentations").insert(presentation).select();

  if (res.error) {
    return res.error.message;
  }

  console.log("Created presentation with id", res.data[0].path_id);

  res = await supabase.from("slides").insert(presentation.slides).select();

  if (res.error) {
    return res.error.message;
  }

  console.log("Added", res.data.length, "slides");

  revalidatePath("/app", "layout");
}

export async function getPresentations(): Promise<PresentationPreview[] | string> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("presentations")
    .select("id, created_at, user_id, path_id, name, description").eq("user_id", (await supabase.auth.getUser())?.data.user?.id);

  if (error) {
    return error.message;
  }

  return data;
}
