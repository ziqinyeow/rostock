// this page is to handle predictions request for next month bond price
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(403).json({ error: "invalid" });
  }
  try {
    // console.log(req.body);

    const data = await fetch(
      "https://id478jvvpg.execute-api.us-east-1.amazonaws.com/stock_prediction",
      {
        method: "POST",
        // @ts-ignore
        headers: {
          "Content-Type": "application/json",
        },
        // @ts-ignore
        body: JSON.stringify({ data: Object.values(JSON.parse(req.body)[0]) }),
      }
    );

    const result = await data.json();

    return res.status(200).json({ result, message: "ok" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}
