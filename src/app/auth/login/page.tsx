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

  return (
    <Card className="mx-2 mt-12">
      <CardHeader>
        <CardTitle>
          <Logo className="mb-2 h-12" />
        </CardTitle>
        <CardDescription>All your transaction in one place.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col-reverse gap-2">
            <Input
              id="email"
              name="email"
              type="email"
              className="peer invalid:text-destructive invalid:focus-visible:ring-destructive"
              placeholder=""
            />
            <Label
              htmlFor="email"
              className="duration-30 transition-all peer-placeholder-shown:translate-x-4 peer-placeholder-shown:translate-y-9 peer-invalid:text-destructive"
            >
              Email
            </Label>
          </div>
          <div className="flex flex-col-reverse gap-2">
            <Input
              id="password"
              name="password"
              type="password"
              className="peer"
              placeholder=""
            />
            <Label
              htmlFor="password"
              className="duration-30 text-foreground transition-all peer-placeholder-shown:translate-x-4 peer-placeholder-shown:translate-y-9 peer-placeholder-shown:text-foreground/80 peer-[:focus-within:placeholder-shown]:text-foreground/80"
            >
              Password
            </Label>
          </div>
          <Button variant="outline" formAction={login}>
            Log In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
