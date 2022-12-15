import { Context, PostConfirmationConfirmSignUpTriggerEvent } from 'aws-lambda';
import { DynamoDB } from '../aws';
import { stackName } from '../configuration';

const docClient = new DynamoDB.DocumentClient();

export const handler = async (
    event: PostConfirmationConfirmSignUpTriggerEvent,
    context: Context,
): Promise<PostConfirmationConfirmSignUpTriggerEvent> => {
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
        const { userAttributes } = event.request;
        const createdDate = new Date();
        const params = {
            TableName: `${stackName}_User`,
            Item: {
                email: userAttributes.email,
                createdAt: createdDate.toISOString(),
                updatedAt: createdDate.toISOString(),
            },
        };

        await docClient.put(params).promise();
    }

    return event;
};
