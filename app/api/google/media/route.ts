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

    // 🚨 Limit file size (Google recommends < 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "File too large (max 5MB)" },
        { status: 400 },
      );
    }

    const auth = await getAuthClient();
    if (!auth) {
      return Response.json({ error: "Authentication failed" }, { status: 401 });
    }

    const accessToken = auth.credentials.access_token;

    const accountService = google.mybusinessaccountmanagement({
      version: "v1",
      auth,
    });

    const accounts = await accountService.accounts.list();
    const accountId = accounts.data.accounts?.[0]?.name;

    if (!accountId) {
      return Response.json({ error: "No account found" }, { status: 400 });
    }

    const locationId = locationName.split("/")[1];

    // ✅ STEP 1 — Start Upload
    console.log("STEP 1 - startUpload success");
    const startUpload = await axios.post(
      `https://mybusiness.googleapis.com/v4/${accountId}/locations/${locationId}/media:startUpload`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log("STEP 1 - startUpload success - End");

    const resourceName = startUpload.data.resourceName;

    // ✅ STEP 2 — Upload Raw Bytes (CRITICAL FIX)
    console.log("STEP 2 - upload bytes success");
    const buffer = Buffer.from(await file.arrayBuffer());

    await axios.post(
      `https://mybusiness.googleapis.com/upload/v1/media/${resourceName}?upload_type=media`,
      buffer,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": file.type || "image/jpeg",
          "Content-Length": buffer.length,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      },
    );
    console.log("STEP 2 - upload bytes success - End");

    // ✅ STEP 3 — Create Media Entry
    console.log("STEP 3 - create media success");
    const createMedia = await axios.post(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/media`,
      {
        mediaFormat: "PHOTO",
        locationAssociation: {
          category: "ADDITIONAL",
        },
        dataRef: {
          resourceName,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log("STEP 3 - create media success - End");

    return Response.json(createMedia.data);
  } catch (error: any) {
    console.error("Media upload error:", error.response?.data || error);
    return Response.json(
      { error: error.response?.data || error.message },
      { status: 500 },
    );
  }
}
