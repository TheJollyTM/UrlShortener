const crypto = require('crypto');

// Base62 characters for encoding
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

// Function to decode Base62 back to number
function base62Decode(str) {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
        num = num * 62 + BASE62.indexOf(str[i]);
    }
    return num;
}

exports.handler = async (event, context) => {
    const { path, queryStringParameters } = event;

    if (path === '/short') {
        // Handle shortening of the URL
        const { url } = queryStringParameters;

        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No URL provided' })
            };
        }

        // Generate hash using MD5
        const hash = crypto.createHash('md5').update(url).digest('hex');

        // Take the first 6 characters of the hash and convert it to a Base62 string
        const shortId = base62Encode(parseInt(hash.substring(0, 6), 16));  // Convert to number and then Base62 encode
        
        // Return the shortened URL
        const shortUrl = `https://jollytm.netlify.app/op?id=${shortId}`;

        return {
            statusCode: 200,
            body: JSON.stringify({ shortenedUrl: shortUrl })
        };

    } else if (path === '/op') {
        // Handle redirection from shortened URL
        const { id } = queryStringParameters;

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No ID provided' })
            };
        }

        // Decode the Base62 ID to get the number
        const decoded = base62Decode(id);
        
        // Convert the decoded value back to a hash-like string (for simulation purposes)
        const hash = decoded.toString(16).padStart(6, '0'); // Re-create the hash for checking
        
        // Simulate finding the original URL by using a mock mapping
        const originalUrl = `https://www.example.com`;  // In practice, you should use a database or memory store to map the IDs back to the URLs.

        return {
            statusCode: 302,
            headers: {
                Location: originalUrl // Simulate the redirect to the original URL
            }
        };
    }

    // Return 404 if the path doesn't match /short or /op
    return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not Found' })
    };
};
