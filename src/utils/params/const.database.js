import dotenv from 'dotenv';
dotenv.config();

export const variablesDB = ({
  railway: process.env.RAILWAY,
  academy: process.env.ACADEMY,
  landing: process.env.LANDING
})

export const variablesS3 = ({
  access_key: process.env.S3_ACCESS_KEY_ID,
  secret_key: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
  bucketAcademy: process.env.S3_BUCKET_ACADEMY,
  bucketLanding: process.env.S3_BUCKET_LANDING,
  domain_name_academy: process.env.DOMAIN_NAME_ACADEMY,
  domain_name_landing: process.env.DOMAIN_NAME_LANDING
})