const crypto = require('crypto');

// Base62 characters (same as used for encoding)
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// Function to convert Base62 string back to number
function base62Decode(str) {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
        num = num * 62 + BASE62.indexOf(str[i]);
    }
    return num;
}

exports.handler = async (event, context) => {
    const { id } = event.queryStringParameters;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'No ID provided' })
        };
    }

    // Decode the Base62 ID back to a number
    const decoded = base62Decode(id);
    
    // Convert the decoded value back to a hash-like string (for simulation purposes)
    const hash = decoded.toString(16).padStart(6, '0'); // Re-create the hash for checking
    
    // Since we're not storing actual mappings, we simulate a check by re-hashing
    const url = `https://example.com/${hash}`;  // Simulating the URL that matches the hash

    // Normally, we'd retrieve this from storage, but here we just simulate it
    return {
        statusCode: 302,
        headers: {
            Location: url // Simulate the redirect
        }
    };
};
