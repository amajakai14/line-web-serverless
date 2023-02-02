import type { GetObjectCommandInput } from "@aws-sdk/client-s3";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../env/server.mjs";

export const getObjectContent = async () => {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
    region: "ap-northeast-1",
  });
  const input: GetObjectCommandInput = {
    Bucket: env.S3_BUCKET,
    Key: "ikuchan.jpeg",
  };
  const command = new GetObjectCommand(input);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log("presigned url", url);
  s3Client.destroy();
  return url;
};

export const putObjectPresignedUrl = async (
  customer_id: number,
  file_id: number,
  file_name: string
) => {
  const key = `${customer_id}/${file_id}/${file_name}`;
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
    region: "ap-northeast-1",
  });
  const LIMIT_5MB = 5e6;
  const url = await createPresignedPost(s3Client, {
    Bucket: env.S3_BUCKET,
    Key: key,
    Conditions: [
      ["starts-with", "$Content-Type", "image/"],
      ["content-length-range", 0, LIMIT_5MB],
    ],
    Expires: 30,
  });
  s3Client.destroy();
  console.log("post url", url);
  return url;
};
