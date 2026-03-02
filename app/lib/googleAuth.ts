// app/lib/googleAuth.ts

import { google } from "googleapis";
import { cookies } from "next/headers";

export async function getAuthClient() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("google_tokens");

  if (!tokenCookie) {
    throw new Error("User not authenticated");
  }

  const tokens = JSON.parse(tokenCookie.value);

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);

  return oauth2Client;
}