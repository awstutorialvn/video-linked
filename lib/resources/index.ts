import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGatewayResource } from './apiGateway';
import { CognitoResource } from './cognito';

export class BaseResources extends NestedStack {
    public apiGateway: ApiGatewayResource;

    public cognito: CognitoResource;

    public constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id, props);

        this.apiGateway = new ApiGatewayResource(this, 'ApiGateway', props);
    }
}
