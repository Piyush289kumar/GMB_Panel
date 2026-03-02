// app/api/google/media/route.ts

import { getAuthClient } from "@/app/lib/googleAuth";
import axios from "axios";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const locationName = formData.get("locationName") as string;
    const category = formData.get("category") as string;

    if (!file || !locationName) {
      return Response.json({ error: "Missing data" }, { status: 400 });
    }

    const auth = await getAuthClient();
    if (!auth) {
      return Response.json({ error: "Authentication failed" }, { status: 401 });
    }

    const accessToken = auth.credentials.access_token;

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

    const locationId = locationName.split("/")[1];

    // 2️⃣ Start upload
    const startUploadRes = await axios.post(
      `https://mybusiness.googleapis.com/v4/${accountId}/locations/${locationId}/media:startUpload`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const resourceName = startUploadRes.data.resourceName;

    // 3️⃣ Upload bytes
    const arrayBuffer = await file.arrayBuffer();

    await axios.post(
      `https://mybusiness.googleapis.com/upload/v1/media/${resourceName}?upload_type=media`,
      arrayBuffer,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": file.type,
        },
      }
    );

    // 4️⃣ Create media entry
    const createMediaRes = await axios.post(
      `https://mybusiness.googleapis.com/v4/${accountId}/locations/${locationId}/media`,
      {
        mediaFormat: "PHOTO",
        locationAssociation: {
          category: category || "ADDITIONAL",
        },
        dataRef: {
          resourceName,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return Response.json(createMediaRes.data);

  } catch (error: any) {
    console.error("Media upload error:", error.response?.data || error);
    return Response.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}