import { NestedStack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationResourcesProps, NestedResourcesProps } from '../interfaces/application';
import { ApiGatewayResource } from './app/apiGateway';
import { DynamoDBResource } from './base/dynamoDB';

export class BaseResources extends NestedStack {
    public dynamoDB: DynamoDBResource;

    public constructor(scope: Construct, id: string, props: NestedResourcesProps) {
        super(scope, id, props);

        this.dynamoDB = new DynamoDBResource(this, 'DynamoDB', props);
    }
}

export class AppResources extends NestedStack {
    public apiGateway: ApiGatewayResource;

    constructor(scope: Construct, id: string, props: ApplicationResourcesProps) {
        super(scope, id, props);

        this.apiGateway = new ApiGatewayResource(this, 'DynamoDB', props);
    }
}
