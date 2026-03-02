// app/api/google/reply/route.ts

import axios from "axios";
import { globalTokens } from "../../auth/callback/route";
import { google } from "googleapis";

export async function POST(req: Request) {
  const { reviewName, comment } = await req.json();
  // reviewName example:
  // accounts/123/locations/456/reviews/789

  try {
    const url = `https://mybusiness.googleapis.com/v4/${reviewName}/reply`;

    const res = await axios.put(
      url,
      { comment },
      {
        headers: {
          Authorization: `Bearer ${globalTokens.access_token}`,
        },
      }
    );

    return Response.json(res.data);

  } catch (error: any) {
    return Response.json({
      error: error.response?.data || error.message,
    });
  }
}