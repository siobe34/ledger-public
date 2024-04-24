import { login } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  const email = "test@public.com";
  const password = "public";

  return (
    <>
      <Card className="mx-2 mt-12">
        <CardHeader>
          <CardTitle>
            <Logo className="mb-2 h-12" />
          </CardTitle>
          <CardDescription>All your transaction in one place.</CardDescription>
          <div className="my-4 rounded border bg-info p-6 text-info-foreground">
            <h1 className="text-lg font-bold underline">Public Credentials</h1>
            <ul>
              <li>Email: {email}</li>
              <li>Password: {password}</li>
            </ul>
          </div>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col-reverse gap-2">
              <Input
                id="email"
                name="email"
                type="email"
                className="peer invalid:text-destructive invalid:focus-visible:ring-destructive dark:invalid:text-destructive-foreground dark:invalid:focus-visible:ring-destructive-foreground"
                placeholder=""
                defaultValue={email}
              />
              <Label
                htmlFor="email"
                className="duration-30 pointer-events-none text-foreground transition-all peer-placeholder-shown:translate-x-4 peer-placeholder-shown:translate-y-9 peer-placeholder-shown:text-foreground/80 peer-invalid:text-destructive peer-[:focus-within:placeholder-shown]:text-foreground/80 dark:peer-invalid:text-destructive-foreground"
              >
                Email
              </Label>
            </div>
            <div className="flex flex-col-reverse gap-2">
              <Input
                id="password"
                name="password"
                type="password"
                className="peer invalid:text-destructive invalid:focus-visible:ring-destructive dark:invalid:text-destructive-foreground dark:invalid:focus-visible:ring-destructive-foreground"
                placeholder=""
                pattern=".{6,}"
                defaultValue={password}
              />
              <Label
                htmlFor="password"
                className="duration-30 pointer-events-none text-foreground transition-all peer-placeholder-shown:translate-x-4 peer-placeholder-shown:translate-y-9 peer-placeholder-shown:text-foreground/80 peer-invalid:text-destructive peer-[:focus-within:placeholder-shown]:text-foreground/80 dark:peer-invalid:text-destructive-foreground"
              >
                Password
              </Label>
            </div>
            <Button variant="outlinePrimary" formAction={login}>
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
