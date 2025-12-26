const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { randomUUID } = require('crypto');

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);
const s3Client = new S3Client({});

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        const courseId = event.pathParameters.courseId;
        const body = JSON.parse(event.body);

        if (!body.fileName || !body.fileType) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'Missing required fields: fileName and fileType'
                })
            };
        }

        const fileId = randomUUID();
        const fileKey = `courses/${courseId}/${fileId}-${body.fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.STORAGE_BUCKET,
            Key: fileKey,
            ContentType: body.fileType
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        const fileMetadata = {
            PK: `COURSE#${courseId}`,
            SK: `FILE#${fileId}`,
            fileId,
            courseId,
            fileName: body.fileName,
            fileKey,
            fileSize: body.fileSize || 0,
            mimeType: body.fileType,
            uploadedAt: new Date().toISOString()
        };

        await ddb.send(new PutCommand({
            TableName: process.env.FILES_TABLE,
            Item: fileMetadata
        }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                uploadUrl,
                fileId,
                fileKey,
                message: 'Use the uploadUrl to PUT your file'
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to generate upload URL',
                message: error.message
            })
        };
    }
};
