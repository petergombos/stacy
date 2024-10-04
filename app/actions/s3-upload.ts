"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { env } from "~/lib/env";
import { actionClient } from "~/lib/safe-action";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export const getSignedUrlAction = actionClient
  .schema(z.object({ fileName: z.string(), fileType: z.string() }))
  .action(async ({ parsedInput }) => {
    const { fileName, fileType } = parsedInput;
    const key = `uploads/${Date.now()}-${fileName}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60 * 5, // URL expires in 5 minutes
    });

    return { signedUrl, key };
  });
