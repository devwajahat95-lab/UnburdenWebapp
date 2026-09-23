import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function getUploadUrl(bucket, key, contentType, expiresIn = 300) {
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn }
  );
  return { uploadUrl: url, key };
}

export async function getDownloadUrl(key, expiresIn = 300) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.R2_PRIVATE_BUCKET, Key: key }),
    { expiresIn }
  );
}

export function publicUrl(key) {
  return `${process.env.REACT_APP_R2_PUBLIC_URL}/${key}`;
}

export async function deleteObject(bucket, key) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export { s3 };
