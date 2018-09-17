import axios from "axios";

let token: string;

/**
 * Get an access token for the Twitter API
 */
export default async function getToken(): Promise<string> {
  if (!token) {
    const { TWITTER_KEY, TWITTER_SECRET } = process.env;
    const {
      data: { access_token }
    } = await axios.post(
      "https://api.twitter.com/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${TWITTER_KEY}:${TWITTER_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8."
        }
      }
    );
    token = access_token;
  }
  return token;
}
