const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        const courseId = event.pathParameters.courseId;
        const body = JSON.parse(event.body);

        if (!body.title || !body.dueDate) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'Missing required fields: title and dueDate'
                })
            };
        }

        const assignmentId = randomUUID();
        const timestamp = new Date().toISOString();

        const assignment = {
            PK: `COURSE#${courseId}`,
            SK: `ASSIGNMENT#${assignmentId}`,
            assignmentId,
            courseId,
            title: body.title,
            description: body.description || '',
            dueDate: body.dueDate,
            status: body.status || 'pending',
            createdAt: timestamp
        };

        await ddb.send(new PutCommand({
            TableName: process.env.ASSIGNMENTS_TABLE,
            Item: assignment
        }));

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(assignment)
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
                error: 'Failed to create assignment',
                message: error.message
            })
        };
    }
};
