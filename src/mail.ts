import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { env } from "./config.ts";

const ses = new SESv2Client({ region: env.awsRegion });

export async function sendMail(opts: { to: string; subject: string; text: string }) {
  return ses.send(
    new SendEmailCommand({
      FromEmailAddress: env.mailFrom,
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
