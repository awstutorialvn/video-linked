import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { NestedStack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from 'aws-cdk-lib/aws-lambda';

import { env } from '../env';
import { ApplicationProps } from './interfaces/application';

export class HealthCheck extends NestedStack {

    public constructor(scope: Construct, id: string, props: ApplicationProps) {
        super(scope, id, props);
        
        const baseResources = props.baseResources;
        const api = baseResources.apiGateway.api;
        const stackName = env.STACK_NAME;
        const healthCheckFunc = new NodejsFunction(this, `${stackName}-health-check`, {
            functionName: `${stackName}-health-check`,
            runtime: Runtime.NODEJS_16_X,
			handler: 'handler',
            entry: path.join(__dirname, `../src/api/health-check/index.ts`),
            bundling: {
                minify: env.isProduction,
                externalModules: [],
            },
        });
        
        const healthCheck = api.root.getResource('health-check') ?? api.root.addResource('health-check');

        // 👇 integrate GET /todos with getTodosLambda
        healthCheck.addMethod(
            'GET',
            new apigateway.LambdaIntegration(healthCheckFunc, {proxy: true}),
        );
    }
};