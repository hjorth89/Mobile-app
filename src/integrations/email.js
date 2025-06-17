import nodemailer from 'nodemailer';
import imaps from 'imap-simple';

export async function authenticate(config = {}) {
  const transporter = nodemailer.createTransport(config);
  await transporter.verify();
  return transporter;
}

export async function fetchData(
  transporter,
  { search = ['ALL'], mailbox = 'INBOX', markSeen = false } = {}
) {
  const { auth = {}, host, port = 993 } = transporter.options || {};
  const config = {
    imap: {
      user: auth.user,
      password: auth.pass,
      host,
      port,
      tls: true,
      authTimeout: 3000,
    },
  };

  const connection = await imaps.connect(config);
  await connection.openBox(mailbox);
  const messages = await connection.search(search, {
    bodies: ['HEADER', 'TEXT'],
    markSeen,
  });
  await connection.end();

  return messages.map(m => {
    const header = m.parts.find(p => p.which === 'HEADER')?.body || {};
    const body = m.parts.find(p => p.which === 'TEXT')?.body;
    return {
      from: header.from?.[0] || '',
      subject: header.subject?.[0] || '',
      date: header.date?.[0] || '',
      body,
    };
  });
}

export async function pushData(transporter, mailOptions) {
  await transporter.sendMail(mailOptions);
  return { success: true };
}

export default { authenticate, fetchData, pushData };
