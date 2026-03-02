// app/api/auth/callback/route.ts

import { google } from "googleapis";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code as string);

  // ✅ Store tokens in secure cookie
  (await cookies()).set("google_tokens", JSON.stringify(tokens), {
    httpOnly: true,
  });

  return Response.redirect("http://localhost:3000/dashboard");
}