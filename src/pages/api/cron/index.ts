import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("doing some background work");
  if (!prisma) {
    res.status(404);
    console.log("no prisma found");
    return res.status(404);
  }
  const result = await prisma.channel.updateMany({
    data: { status: "EXPIRED" },
    where: { time_end: { lte: new Date() } },
  });
  res.status(200).json({ count: result.count });
}

/**
 * verifySignature will try to load `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY` from the environment.

 * To test out the endpoint manually (wihtout using QStash), you can do `export default handler` instead and
 * hit this endpoint via http://localhost:3000/api/cron
 */
// export default verifySignature(handler);