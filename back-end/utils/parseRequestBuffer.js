const readRequestBodyBuffer = (req) => {
    return new Promise((resolve, reject) => {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', (err) => {
            reject(err);
        });
    });
}

const getBoundary = (request) => {
    let contentType = request.headers['content-type'];
    const contentTypeArray = contentType.split(';').map(item => item.trim());
    const boundaryPrefix = 'boundary=';
    let boundary = contentTypeArray.find(item => item.startsWith(boundaryPrefix));
    if (!boundary) return null;
    boundary = boundary.slice(boundaryPrefix.length);
    if (boundary) boundary = boundary.trim();
    return boundary;
}

module.exports = {
    readRequestBodyBuffer,
    getBoundary
}