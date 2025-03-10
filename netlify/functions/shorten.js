const crypto = require('crypto');

let urlMappings = {};  // Temporary in-memory storage, could be replaced with a database

exports.handler = async (event, context) => {
    const { url } = JSON.parse(event.body);
    
    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'No URL provided' })
        };
    }

    // Generate a short identifier (e.g., first 6 characters of MD5 hash)
    const shortId = crypto.createHash('md5').update(url).digest('hex').slice(0, 6);
    
    // Store the mapping (this is temporary storage; for production, you'd use a persistent database)
    urlMappings[shortId] = url;

    // Return the shortened URL
    const shortUrl = `https://your-site-name.netlify.app/.netlify/functions/openurl?id=${shortId}`;
    
    return {
        statusCode: 200,
        body: JSON.stringify({ shortenedUrl: shortUrl })
    };
};
