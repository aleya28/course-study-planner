const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        const result = await ddb.send(new QueryCommand({
            TableName: process.env.COURSES_TABLE,
            IndexName: 'PublicCoursesIndex',
            KeyConditionExpression: 'isPublic = :isPublic',
            ExpressionAttributeValues: {
                ':isPublic': 'true'
            }
        }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=10'
            },
            body: JSON.stringify({
                courses: result.Items || [],
                count: result.Count
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
                error: 'Failed to get public catalog',
                message: error.message
            })
        };
    }
};
