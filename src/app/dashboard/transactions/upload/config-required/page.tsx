import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function ConfigRequiredPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Users and Categories</CardTitle>
        <CardDescription>
          You were redirected to this page because users and/or categories need
          to be added to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Transactions data must be uploaded for specific Users and each
          Transaction must be assigned to a specific Category. These Users and
          Categories must be configured prior to uploading data.
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href="/dashboard/account-management"
          className={buttonVariants({ size: "lg" })}
        >
          Configure Now
        </Link>
      </CardFooter>
    </Card>
  );
}
