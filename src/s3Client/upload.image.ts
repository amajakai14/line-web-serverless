import type { PresignedPost } from "@aws-sdk/s3-presigned-post";

export const uploadImage = async (file: File, presignedUri: PresignedPost) => {
  const { url, fields } = presignedUri;
  const data = {
    ...(fields as any),
    "Content-type": file.type,
    file,
  };
  const formData = new FormData();
  for (const name in data) {
    formData.append(name, data[name]);
  }
  const result = await fetch(url, {
    method: "POST",
    body: formData,
  });
  return result.ok;
};
