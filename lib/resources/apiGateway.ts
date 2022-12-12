import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { env } from '../../env';
import { AuthorizationType, CfnAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { CognitoResource } from './cognito';

export class ApiGatewayResource extends NestedStack {
    private cognito: CognitoResource;

    public api: apigateway.RestApi;

    public cognitoAuthorizer: { authorizerId: string; authorizationType: AuthorizationType };

    public constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id, props);
        const stackName = env.isProd ? env.STACK_NAME : `${env.STAGE_NAME}-${env.STACK_NAME}`;
        this.api = new apigateway.RestApi(this, `${stackName}-api`, {
            description: 'video linked api gateway',
            deployOptions: {
                stageName: env.STAGE_NAME,
            },
            // 👇 enable CORS
            defaultCorsPreflightOptions: {
                allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
                allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowCredentials: true,
                allowOrigins: ['*'],
            },
        });
        this.cognito = new CognitoResource(this, 'Cognito', props);

        // 👇 create an Output for the API URL
        new cdk.CfnOutput(this, 'apiUrl', { value: this.api.url });

        const cognitoAuthorizerName = `${stackName}-cognito-authorizer`;
        const cognitoCfnAuthorizer = new CfnAuthorizer(this, cognitoAuthorizerName, {
            restApiId: this.api.restApiId,
            name: cognitoAuthorizerName,
            type: 'COGNITO_USER_POOLS',
            identitySource: 'method.request.header.Authorization',
            providerArns: [this.cognito.userPool.userPoolArn],
        });

        new cdk.CfnOutput(this, 'cognitoAuthorizerName', { value: cognitoCfnAuthorizer.name });

        this.cognitoAuthorizer = {
            authorizerId: cognitoCfnAuthorizer.ref,
            authorizationType: AuthorizationType.COGNITO,
        };
    }
}
