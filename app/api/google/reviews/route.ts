// app/api/google/reviews/route.ts

import { getAuthClient } from "@/app/lib/googleAuth";
import { google } from "googleapis";

export async function GET() {
  const auth = getAuthClient();

  const mybusiness = google.mybusiness({
    version: "v4",
    auth,
  });

  const accounts = await google.mybusinessaccountmanagement({
    version: "v1",
    auth,
  }).accounts.list();

  const accountId = accounts.data.accounts?.[0]?.name;

  const locations = await google.mybusinessbusinessinformation({
    version: "v1",
    auth,
  }).accounts.locations.list({
    parent: accountId as string,
  });

  const locationName = locations.data.locations?.[0]?.name;

  const reviews = await mybusiness.accounts.locations.reviews.list({
    parent: locationName as string,
  });

  return Response.json(reviews.data);
}