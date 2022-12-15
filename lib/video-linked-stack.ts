import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { AppResources, BaseResources } from './resources';
import { ApplicationResourcesProps, Configuration, ApplicationProps } from './interfaces/application';
import { HealthCheck } from './functions/health-check';
import { env } from '../env/cdk';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class VideoLinkedStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        const configuration: Configuration = {
            stackName: props.stackName ?? 'video-linked',
            environment: {
                STACK_NAME: env.STACK_NAME,
                NODE_ENV: env.NODE_ENV,
                STAGE_NAME: env.STAGE_NAME,
                REGION: env.REGION,
            },
        };

        // init base resource
        const baseResources = new BaseResources(this, 'baseResources', { configuration });
        const applicationResourcesProps: ApplicationResourcesProps = {
            configuration,
            baseResources,
        };

        // init app resource
        const appResources = new AppResources(this, 'appResources', applicationResourcesProps);
        const applicationProps: ApplicationProps = {
            configuration,
            baseResources,
            appResources,
        };

        // init Function Lambda
        new HealthCheck(this, 'healthCheck', applicationProps);
    }
}
