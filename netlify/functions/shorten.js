const crypto = require('crypto');

// Base62 characters
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// Function to convert a number into Base62 string
function base62Encode(num) {
    let base62 = '';
    while (num > 0) {
        base62 = BASE62[num % 62] + base62;
        num = Math.floor(num / 62);
    }
    return base62;
}

exports.handler = async (event, context) => {
    const { url } = event.queryStringParameters;

    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'No URL provided' })
        };
    }

    // Generate hash using MD5
    const hash = crypto.createHash('md5').update(url).digest('hex');

    // Take first 6 characters of hash to create a shorter URL
    const shortId = base62Encode(parseInt(hash.substring(0, 6), 16));  // Convert to number and then base62 encode
    
    // Return the shortened URL
    const shortUrl = `https://your-site-name.netlify.app/.netlify/functions/openurl?id=${shortId}`;

    return {
        statusCode: 200,
        body: JSON.stringify({ shortenedUrl: shortUrl })
    };
};
