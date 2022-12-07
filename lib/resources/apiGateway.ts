import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { env } from '../../env';

export class ApiGatewayResource extends NestedStack {
    public api: apigateway.RestApi;

    public constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id, props);
        const stackName = env.STACK_NAME;
        this.api = new apigateway.RestApi(this, `${stackName}-api`, {
            description: 'video linked api gateway',
            deployOptions: {
                stageName: env.STAGE_NAME,
            },
            // 👇 enable CORS
            defaultCorsPreflightOptions: {
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                ],
                allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowCredentials: true,
                allowOrigins: ['*'],
            },
        });
        // 👇 create an Output for the API URL
		new cdk.CfnOutput(this, 'apiUrl', { value: this.api.url });
    }
};
