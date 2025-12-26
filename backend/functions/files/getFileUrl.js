const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);
const s3Client = new S3Client({});

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        const fileId = event.pathParameters.fileId;

        const result = await ddb.send(new ScanCommand({
            TableName: process.env.FILES_TABLE,
            FilterExpression: 'fileId = :fileId',
            ExpressionAttributeValues: {
                ':fileId': fileId
            }
        }));

        if (!result.Items || result.Items.length === 0) {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'File not found' })
            };
        }

        const fileMetadata = result.Items[0];

        const command = new GetObjectCommand({
            Bucket: process.env.STORAGE_BUCKET,
            Key: fileMetadata.fileKey
        });

        const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                downloadUrl,
                fileName: fileMetadata.fileName,
                mimeType: fileMetadata.mimeType,
                fileSize: fileMetadata.fileSize
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
                error: 'Failed to get file URL',
                message: error.message
            })
        };
    }
};
