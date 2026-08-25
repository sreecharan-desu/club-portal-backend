import nodemailer from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const host = process.env.SMTP_HOST;
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "ap-south-1";
const useMaildev = host === "localhost" || host === "127.0.0.1";

const ses = new SESv2Client({ region });

export async function sendMail(opts: { to: string; subject: string; text: string }) {
  const from = process.env.MAIL_FROM;
  if (!from) throw new Error("MAIL_FROM is not set");

  // Default: SES SendEmail via `aws configure` (same keys as the CLI).
  // MailDev only when SMTP_HOST is explicitly localhost.
  if (useMaildev) {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 1025),
      secure: false,
    });
    return transporter.sendMail({ from, ...opts });
  }

  return ses.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: { ToAddresses: [opts.to] },
      Content: {
        Simple: {
          Subject: { Data: opts.subject, Charset: "UTF-8" },
          Body: { Text: { Data: opts.text, Charset: "UTF-8" } },
        },
      },
    }),
  );
}

export default sendMail;
