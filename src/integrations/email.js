import imaps from 'imap-simple';

// Nodemailer relies on Node-specific modules that aren't available in React
// Native. The email integration now expects a backend service to handle
// sending messages. The `authenticate` helper simply stores configuration
// details for later use.

export async function authenticate(config = {}) {
  // Simply return the configuration. A backend service or another library
  // should use these details to perform the actual authentication.
  return config;
}

export async function fetchData(
  config,
  { search = ['ALL'], mailbox = 'INBOX', markSeen = false } = {}
) {
  const { auth = {}, host, port = 993 } = config || {};
  const imapConfig = {
    imap: {
      user: auth.user,
      password: auth.pass,
      host,
      port,
      tls: true,
      authTimeout: 3000,
    },
  };

  const connection = await imaps.connect(imapConfig);
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

export async function pushData(config, mailOptions) {
  if (!config?.sendEndpoint) {
    throw new Error('Missing sendEndpoint in email configuration');
  }
  const response = await fetch(config.sendEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mailOptions),
  });
  if (!response.ok) {
    throw new Error('Failed to send email');
  }
  return { success: true };
}

export default { authenticate, fetchData, pushData };
