// app/api/google/locations/route.ts
import { google } from "googleapis";
import { getAuthClient } from "@/app/lib/googleAuth";

export async function GET() {
  const auth = getAuthClient();

  const accountService = google.mybusinessaccountmanagement({
    version: "v1",
    auth,
  });

  const infoService = google.mybusinessbusinessinformation({
    version: "v1",
    auth,
  });

  const accounts = await accountService.accounts.list();
  const accountList = accounts.data.accounts || [];

  let allLocations: any[] = [];

  for (const acc of accountList) {
    const locations = await infoService.accounts.locations.list({
      parent: acc.name!,
      readMask:
        "name,title,storeCode,phoneNumbers,websiteUri,storefrontAddress,openInfo",
    });
    
    console.log(locations.data.locations);

    if (locations.data.locations) {
      allLocations = [...allLocations, ...locations.data.locations];
    }
  }

  return Response.json({ locations: allLocations });
}