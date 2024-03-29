"use client";

import { Logo } from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const signOut = async () => {
      const status = await supabase.auth.signOut();

      if (status.error) {
        router.push("/error");
      }
      router.replace("/auth/login");
    };
    signOut();
  }, []);

  return (
    <Card className="mx-2 mt-12">
      <CardHeader>
        <CardTitle>
          <Logo className="mb-2 h-12" />
        </CardTitle>
        <CardDescription>All your transaction in one place.</CardDescription>
      </CardHeader>

      <CardContent className="text-lg">Signing out...</CardContent>
    </Card>
  );
}
