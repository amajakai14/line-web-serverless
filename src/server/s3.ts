import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
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
    Bucket: "test-restaurant",
    Key: "ikuchan.jpeg",
  };
  const command = new GetObjectCommand(input);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log("presigned url", url);
  s3Client.destroy();
  return url;
};

export const putObjectPresignedUrl = async () => {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
    region: "ap-northeast-1",
  });
  const input: PutObjectCommandInput = {
    Key: "abcdef.jpeg",
    Bucket: "test-restaurant",
  };
  const command = new PutObjectCommand(input);
  const xurl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  s3Client.destroy();
  console.log("post url", xurl);
  return xurl;
};
