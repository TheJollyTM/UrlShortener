let urlMappings = {};  // Temporary in-memory storage, could be replaced with a database

exports.handler = async (event, context) => {
    const { id } = event.queryStringParameters;

    if (!id || !urlMappings[id]) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'URL not found' })
        };
    }

    // Retrieve the original URL using the short ID
    const originalUrl = urlMappings[id];

    // Redirect to the original URL
    return {
        statusCode: 302,
        headers: {
            Location: originalUrl
        }
    };
};
