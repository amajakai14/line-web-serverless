import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  try {
    const { authorization } = req.headers;
    if (authorization === `Bearer ${env.CRON_SECRET}`) {
      res.status(200).json({ success: false, message: "matched" });
      return;
    }
    res.status(200).json({ success: false, message: "unmatched" });
    return;
    if (authorization !== `Bearer ${env.CRON_SECRET}`) {
      res.status(403).json({ success: false });
      return;
    }

    if (!prisma) {
      res.status(404).json({ success: false, message: "prisma no found" });
      return;
    }

    const data = await prisma.channel.updateMany({
      data: { status: "EXPIRED" },
      where: { time_end: { lte: new Date() } },
    });
    res.status(200).json({
      success: true,
      message: `${data.count} items have been updated`,
    });
    return;
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
