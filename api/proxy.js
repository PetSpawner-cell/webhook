// Vercel Serverless Function: api/proxy.js
// FINAL CORRECTED VERSION

export default async function handler(request, response) {
  // --- CONFIGURATION ---
  // This should already be correct from your previous setup.
  const discordWebhookUrl = "https://discord.com/api/webhooks/1385266080749977600/rDo4jJ8MJB8czJLWIo5nSx0nGfuseiAuGiaEJIX1z4tMFsBenMHSnclipVeEt5QrFoxb";
  // ---------------------

  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // THE FIX IS HERE: We now pass request.body directly, without re-stringifying it.
    const discordResponse = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.body, // <-- THIS IS THE CORRECTED LINE
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      response.status(discordResponse.status).send(`Error from Discord: ${errorText}`);
      return;
    }

    response.status(200).send('Webhook forwarded successfully!');

  } catch (error) {
    response.status(500).send(`Server Error: ${error.message}`);
  }
}
