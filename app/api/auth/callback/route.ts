// app/api/auth/callback/route.ts

// import { google } from "googleapis";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const code = searchParams.get("code");

//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     "http://localhost:3000/api/auth/callback",
//   );

//   const { tokens } = await oauth2Client.getToken(code as string);
//   oauth2Client.setCredentials(tokens);

//   // Save tokens in DB
//   console.log(tokens);

//   return Response.redirect(
//     `http://localhost:3000/profile?access_token=${tokens.access_token}`,
//   );
// }



import { google } from "googleapis";

let globalTokens: any = null;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code as string);

  globalTokens = tokens;

  return Response.redirect("http://localhost:3000/dashboard");
}

export { globalTokens };