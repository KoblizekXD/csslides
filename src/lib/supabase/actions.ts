"use server";

import type { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomId, removeAttrFromObject } from "../utils";
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
  presentation: string;
}

export interface Presentation {
  id: number;
  created_at: string;
  user_id: string;
  path_id: string;
  name: string;
  description: string;
  slides: Slide[];
  shared: boolean;
}

export type PresentationPreview = Omit<Presentation, "slides">;

export async function getPresentations(): Promise<
  PresentationPreview[] | string
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("presentations")
    .select("id, created_at, user_id, path_id, name, description, shared")
    .eq("user_id", (await supabase.auth.getUser())?.data.user?.id);

  if (error) {
    return error.message;
  }

  return data;
}

export async function createPresentation(
  name: string,
  description: string
): Promise<string | undefined> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    return "Not authenticated";
  }
  if (user.error) {
    return user.error.message;
  }

  const path = randomId();

  const presentation = {
    user_id: user.data.user.id,
    path_id: path,
    name,
    description,
  } satisfies Omit<Presentation, "id" | "created_at" | "slides" | "shared">;

  const { error } = await supabase.from("presentations").insert(presentation);

  if (error) {
    return error.message;
  }

  revalidatePath(`/app/${path}`, "layout");
}

export async function getPresentation(
  pathId: string
): Promise<string | Presentation> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    return "Not authenticated";
  }
  if (user.error) {
    return user.error.message;
  }

  const result = await supabase
    .from("presentations")
    .select("*")
    .eq("path_id", pathId)
    .single();

  if (result.error) {
    return result.error.message;
  }

  const res = result.data as Presentation;

  const slides = await supabase
    .from("slides")
    .select("*")
    .eq("presentation", res.id);

  if (slides.error) {
    return slides.error.message;
  }

  res.slides = slides.data as Slide[];

  return res;
}

export async function createSlide(
  name: string,
  presentation: Presentation
): Promise<Slide | undefined> {
  const supabase = await createClient();

  return await supabase
    .from("slides")
    .insert({
      html: "",
      css: "",
      name,
      presentation: presentation.id,
    })
    .select()
    .single()
    .then((res) => res.data as Slide);
}

export async function savePresentation(presentation: Presentation) {
  const supabase = await createClient();

  let res = await supabase.from("slides").upsert(presentation.slides);

  if (res.error) {
    return res.error.message;
  }

  res = await supabase
    .from("presentations")
    .upsert(removeAttrFromObject(presentation, "slides"));

  if (res.error) {
    return res.error.message;
  }
}

export async function enableSharing(id: number): Promise<string | undefined> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("presentations")
    .update({ shared: true })
    .eq("id", id);

  if (error) {
    return error.message;
  }

  revalidatePath(`/shared/${id}`, "layout");
}

export async function getUser(): Promise<User | string> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (user.error) return user.error.message;

  return user.data.user;
}
