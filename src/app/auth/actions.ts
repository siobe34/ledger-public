"use server";

import { loginSchema } from "@/lib/schemas/login";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const login = async (formData: FormData) => {
  const supabase = createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const zodParser = loginSchema.safeParse(data);

  if (!zodParser.success) {
    redirect("/error");
  }

  const parsedLoginData = zodParser.data;

  const { error } = await supabase.auth.signInWithPassword(parsedLoginData);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
};
