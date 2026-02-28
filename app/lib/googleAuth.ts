import { google } from "googleapis";
import { globalTokens } from "../api/auth/callback/route";

export function getAuthClient() {
  const oauth2Client = new google.auth.OAuth2();

  oauth2Client.setCredentials(globalTokens);

  return oauth2Client;
}