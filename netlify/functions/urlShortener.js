const Redis = require("ioredis");
const crypto = require("crypto");

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD
});

// Function to generate a short ID
function generateShortId(url) {
    const hash = crypto.createHash('md5').update(url).digest('hex');
    let numericHash = BigInt('0x' + hash);
    let shortId = '';
    while (numericHash > 0n) {
        shortId = BASE62[Number(numericHash % 62n)] + shortId;
        numericHash /= 62n;
    }
    return shortId.slice(0, 10); // Max 10 chars
}

exports.handler = async (event) => {
    const { path, queryStringParameters: params } = event;

    if (path.endsWith("/short")) {
        if (!params.url) return { statusCode: 400, body: "Error: No URL provided" };

        // Check if the long URL is already stored
        const existingShortId = await redis.get(`long:${params.url}`);
        if (existingShortId) {
            return { statusCode: 200, body: `https://jly.netlify.app/op?id=${existingShortId}` };
        }

        // Generate and store a new short ID
        const shortId = generateShortId(params.url);
        await redis.setex(shortId, 600, params.url);       // Store short 
        await redis.setex(`long:${params.url}`, 600, shortId); // Store long 

        return { statusCode: 200, body: `https://jly.netlify.app/op?id=${shortId}` };
    }

    if (path.endsWith("/op")) {
        if (!params.id) return { statusCode: 400, body: "Error: No ID provided" };
        const originalUrl = await redis.get(params.id);
        if (!originalUrl) return { statusCode: 404, body: "Error: URL expired or not found" };
        return { statusCode: 302, headers: { Location: originalUrl } };
    }

    return { statusCode: 404, body: "Error: Invalid request" };
};
