import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGatewayResource } from './apiGateway';

export class BaseResources extends NestedStack {
    public apiGateway: ApiGatewayResource

    public constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id, props);

        this.apiGateway = new ApiGatewayResource(this, 'ApiGateway', props);
    }
};
