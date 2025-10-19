import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "#/clients/env";

const s3Client = new S3Client({
  region: "auto",
  endpoint: env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export const uploadFile = async (key: string, body: Blob) => {
  const arrayBuffer = await body.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const contentType =
    body.type && body.type.length > 0 ? body.type : "application/octet-stream";

  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: bytes,
      ContentLength: bytes.byteLength,
      ContentType: contentType,
    })
  );
  return getFileUrl(key);
};

export const getFileUrl = (key: string) => {
  return `${env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
};
