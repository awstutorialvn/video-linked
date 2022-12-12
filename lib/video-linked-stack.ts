import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { BaseResources } from './resources';
import { ApplicationProps, Configuration } from './interfaces/application';
import { HealthCheck } from './health-check';
import { env } from '../env';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class AppResources extends cdk.NestedStack {
    constructor(scope: Construct, id: string, props: ApplicationProps) {
        super(scope, id, props);

        new HealthCheck(this, 'healthCheck', props);
    }
}

export class VideoLinkedStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const configuration: Configuration = {
            stackName: env.isProd ? env.STACK_NAME : `${env.STAGE_NAME}-${env.STACK_NAME}`,
        };

        // init base resource
        const baseResources = new BaseResources(this, 'baseResources');

        new AppResources(this, 'appResources', {
            configuration,
            baseResources,
        });
    }
}
