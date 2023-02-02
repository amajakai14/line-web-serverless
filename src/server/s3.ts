import type { GetObjectCommandInput } from "@aws-sdk/client-s3";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../env/server.mjs";

export const getObjectContent = async (
  customer_id: string,
  menu_id: number
) => {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
    region: "ap-northeast-1",
  });
  const input: GetObjectCommandInput = {
    Bucket: env.S3_BUCKET,
    Key: `${customer_id}/${menu_id}`,
  };
  const command = new GetObjectCommand(input);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log("presigned url", url);
  s3Client.destroy();
  return url;
};

export const putObjectPresignedUrl = async (
  customer_id: string,
  menu_id: number
) => {
  const key = `${customer_id}/${menu_id}`;
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
    region: "ap-northeast-1",
  });

  const LIMIT_SIZE = 2e7; // 20MB
  const url = await createPresignedPost(s3Client, {
    Bucket: env.S3_BUCKET,
    Key: key,
    Conditions: [
      ["starts-with", "$Content-Type", "image/"],
      ["content-length-range", 0, LIMIT_SIZE],
    ],
    Expires: 30,
  });
  s3Client.destroy();
  console.log("post url", url);
  return url;
};
