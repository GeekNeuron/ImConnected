// This is our Vercel Serverless Function (our backend)

export default async function handler(request, response) {
  // 1. Get the target URL from the query string (e.g., /api/fetch?url=https://...)
  const targetUrl = request.query.url;

  if (!targetUrl) {
    return response.status(400).send('Please provide a URL parameter.');
  }

  try {
    // 2. Fetch the content of the target URL.
    // This happens on the server, so there is no CORS issue.
    const fetchResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch: ${fetchResponse.status} ${fetchResponse.statusText}`);
    }

    const htmlContent = await fetchResponse.text();

    // 3. Set CORS headers to allow our frontend (on any domain) to access this API
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // 4. Send the fetched HTML content back to our frontend
    return response.status(200).send(htmlContent);

  } catch (error) {
    console.error(error);
    return response.status(500).send(`Server error: ${error.message}`);
  }
}
