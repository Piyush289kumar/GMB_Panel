// app/api/google/reviews/route.ts


import axios from "axios";
import { getAuthClient } from "@/app/lib/googleAuth";
import { google } from "googleapis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locationName = searchParams.get("location"); 
  // example: locations/8008899913666095565

  if (!locationName) {
    return Response.json({ error: "No location provided" });
  }

  try {
    // ✅ get auth from cookies
    const auth = await getAuthClient();

    // 1️⃣ Get accountId
    const accountService = google.mybusinessaccountmanagement({
      version: "v1",
      auth,
    });

    const accounts = await accountService.accounts.list();
    const accountId = accounts.data.accounts?.[0]?.name;

    if (!accountId) {
      return Response.json({ error: "No account found" });
    }

    // 2️⃣ Extract locationId
    const locationId = locationName.split("/")[1];

    // 3️⃣ Get access_token safely
    const accessToken = auth.credentials.access_token;

    const url = `https://mybusiness.googleapis.com/v4/${accountId}/locations/${locationId}/reviews`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return Response.json({
      reviews: res.data.reviews || [],
    });

  } catch (error: any) {
    console.error("Reviews error:", error);
    return Response.json({
      error: error.response?.data || error.message,
    }, { status: 500 });
  }
}