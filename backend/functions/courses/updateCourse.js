const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const courseId = event.pathParameters.courseId;
        const body = JSON.parse(event.body);

        const updateExpressions = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        // Build dynamic update expression
        if (body.title !== undefined) {
            updateExpressions.push('#title = :title');
            expressionAttributeNames['#title'] = 'title';
            expressionAttributeValues[':title'] = body.title;
        }
        if (body.description !== undefined) {
            updateExpressions.push('#description = :description');
            expressionAttributeNames['#description'] = 'description';
            expressionAttributeValues[':description'] = body.description;
        }
        if (body.instructor !== undefined) {
            updateExpressions.push('#instructor = :instructor');
            expressionAttributeNames['#instructor'] = 'instructor';
            expressionAttributeValues[':instructor'] = body.instructor;
        }
        if (body.semester !== undefined) {
            updateExpressions.push('#semester = :semester');
            expressionAttributeNames['#semester'] = 'semester';
            expressionAttributeValues[':semester'] = body.semester;
        }
        if (body.credits !== undefined) {
            updateExpressions.push('#credits = :credits');
            expressionAttributeNames['#credits'] = 'credits';
            expressionAttributeValues[':credits'] = body.credits;
        }
        if (body.isPublic !== undefined) {
            updateExpressions.push('#isPublic = :isPublic');
            expressionAttributeNames['#isPublic'] = 'isPublic';
            expressionAttributeValues[':isPublic'] = body.isPublic ? 'true' : 'false';
        }

        // Always update the updatedAt timestamp
        updateExpressions.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();

        if (updateExpressions.length === 0) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'No fields to update' })
            };
        }

        const result = await ddb.send(new UpdateCommand({
            TableName: process.env.COURSES_TABLE,
            Key: {
                PK: `USER#${userId}`,
                SK: `COURSE#${courseId}`
            },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result.Attributes)
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
                error: 'Failed to update course',
                message: error.message
            })
        };
    }
};
