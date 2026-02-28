import { google } from "googleapis";
import { getAuthClient } from "@/app/lib/googleAuth";

export async function POST(req: Request) {
  const { reviewName, comment } = await req.json();

  const auth = getAuthClient();

  const mybusiness = google.mybusiness({
    version: "v4",
    auth,
  });

  const res = await mybusiness.accounts.locations.reviews.updateReply({
    name: `${reviewName}/reply`,
    requestBody: { comment },
  });

  return Response.json(res.data);
}