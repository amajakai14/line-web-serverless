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
    if (authorization !== `Bearer ${env.CRON_SECRET}`) {
      res.status(403).json({ success: false });
      return;
    }

    if (!prisma) {
      res.status(404).json({ success: false, message: "prisma no found" });
      return;
    }
    const needUpdate = await prisma.channel.findMany({
      select: { id: true, table_id: true },
      where: { status: "ONLINE", time_end: { lte: new Date() } },
    });
    const ids = needUpdate.map((item) => item.id);
    const deskIds = needUpdate.map((item) => item.table_id);
    if (ids.length === 0) {
      res.status(200).json({
        success: true,
        message: "No items need to be updated",
      });
    }

    const data = await prisma.$transaction([
      prisma.channel.updateMany({
        data: { status: "EXPIRED" },
        where: { id: { in: ids } },
      }),
      prisma.desk.updateMany({
        data: { is_occupied: false },
        where: {
          id: { in: deskIds },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: `${data[0].count} channels have been updated. ${data[1].count} desks have been updated.}`,
    });
    return;
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
