import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  SendSmtpEmail,
  type SendSmtpEmailReplyTo,
  type SendSmtpEmailSender,
} from '@getbrevo/brevo';

export interface SendEmailOptions {
  sender?: SendSmtpEmailSender;
  replyTo?: SendSmtpEmailReplyTo;
  toName?: string;
}

export async function sendEmail(
  email: string,
  subject: string,
  html: string,
  options?: SendEmailOptions,
) {
  const {
    sender = {
      name: 'Vue AI Tools',
      email: 'info@vueai.tools',
    },
    replyTo = {
      email: 'info@vueai.tools',
      name: 'Chris Paganon',
    },
    toName,
  } = options || {};

  const emailAPI = new TransactionalEmailsApi();
  emailAPI.setApiKey(
    TransactionalEmailsApiApiKeys.apiKey,
    useRuntimeConfig().brevoApiKey,
  );

  const message = new SendSmtpEmail();
  message.subject = subject;
  message.htmlContent = html;
  message.replyTo = replyTo;
  message.sender = sender;
  message.to = [{ email }];
  if (toName) {
    message.to[0].name = toName;
  }

  await emailAPI.sendTransacEmail(message);
}
