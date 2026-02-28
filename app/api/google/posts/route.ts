import { google } from "googleapis";
import { getAuthClient } from "@/app/lib/googleAuth";

export async function POST(req: Request) {
  const { locationName, summary } = await req.json();

  const auth = getAuthClient();

  const mybusiness = google.mybusiness({
    version: "v4",
    auth,
  });

  const post = await mybusiness.accounts.locations.localPosts.create({
    parent: locationName,
    requestBody: {
      languageCode: "en",
      summary,
    },
  });

  return Response.json(post.data);
}