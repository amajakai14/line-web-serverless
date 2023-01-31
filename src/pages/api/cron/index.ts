import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env/server.mjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      console.log("header ", authorization);

      if (authorization === `Bearer ${env.CRON_SECRET}` && prisma) {
        await prisma.channel.updateMany({
          data: { status: "EXPIRED" },
          where: { time_end: { lte: new Date() } },
        });
        res.status(200).json({ success: true });
      }
      res.status(403).json({ success: false});
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
