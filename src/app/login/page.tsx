import { login, signout } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

// TODO: clean up auth page
export default async function LoginPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" />
      <button formAction={login}>Log in</button>
      <button formAction={signout}>Sign out</button>
    </form>
  );
}
