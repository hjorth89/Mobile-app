// Direct IMAP access is not available in React Native because libraries like
// `imap-simple` rely on Node core modules such as `net` and `tls`.
// The email integration therefore delegates fetching messages to a backend
// service or provider HTTP API.

// Nodemailer relies on Node-specific modules that aren't available in React
// Native. The email integration now expects a backend service to handle
// sending messages. The `authenticate` helper simply stores configuration
// details for later use.

export async function authenticate(config = {}) {
  // Simply return the configuration. A backend service or another library
  // should use these details to perform the actual authentication.
  return config;
}

export async function fetchData(config, params = {}) {
  if (!config?.fetchEndpoint) {
    throw new Error('Missing fetchEndpoint in email configuration');
  }

  const res = await fetch(config.fetchEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch mail: ${res.status} ${text}`);
  }

  return res.json();
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
