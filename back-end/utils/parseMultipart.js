module.exports = (stringBody, boundary) => {
    const boundaryString = '--' + boundary;
    const rawData = stringBody.split(boundaryString);
    const fileData = rawData[1];
    const fileDataArray = fileData.split('\r\n\r\n');
    const fileHeader = fileDataArray[0];
    const fileBody = fileDataArray[1];
    const fileHeaderArray = fileHeader.split('\r\n');
    const fileName = fileHeaderArray[1].split(';')[2].trim().split('=')[1].replace(/"/g, '');
    const fileContentType = fileHeaderArray[2].split(':')[1].trim();

    const fileBodyBuffer = Buffer.from(fileBody, 'binary');

    return {
        fileName,
        fileContentType,
        fileBodyBuffer
    }
}