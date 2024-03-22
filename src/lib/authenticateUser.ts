import { db } from "@/server/db";
import { metadatas } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// Given an email string, verify whether a user is registered in the database and authenticated
export const authenticateUser = async ({ email }: { email: string }) => {
  const emailId = await db
    .select({ id: metadatas.id })
    .from(metadatas)
    .where(eq(metadatas.email, email));
  return emailId[0]?.id;
};
