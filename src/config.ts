import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: required("JWT_SECRET"),
  appUrl: required("APP_URL"),
  awsRegion: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "ap-south-1",
  mailFrom: required("MAIL_FROM"),
  databaseUrl: required("DATABASE_URL"),
};
