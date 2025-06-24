// Vercel Serverless Function: api/proxy.js
// This code listens for a request and forwards it to your real webhook.

export default async function handler(request, response) {
  // --- CONFIGURATION ---
  // Paste your REAL Discord webhook URL here, inside the quotes.
  const discordWebhookUrl = "https://discord.com/api/webhooks/1385266080749977600/rDo4jJ8MJB8czJLWIo5nSx0nGfuseiAuGiaEJIX1z4tMFsBenMHSnclipVeEt5QrFoxb";
  // ---------------------

  // 1. Check if the incoming request is a POST request, which Roblox uses.
  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // 2. Forward the incoming request to the real Discord webhook URL.
    // We use the body and headers from the original request.
    const discordResponse = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
     
    body: request.body,
    });

    // 3. Check if Discord accepted the request.
    if (!discordResponse.ok) {
      // If Discord returned an error, pass that error back.
      const errorText = await discordResponse.text();
      response.status(discordResponse.status).send(`Error from Discord: ${errorText}`);
      return;
    }

    // 4. If everything was successful, send a success response.
    response.status(200).send('Webhook forwarded successfully!');

  } catch (error) {
    // If there was a network error, send a server error response.
    response.status(500).send(`Server Error: ${error.message}`);
  }
}
