import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { AppResources, BaseResources } from './resources';
import { ApplicationResourcesProps, Configuration, ApplicationProps } from './interfaces/application';
import { HealthCheck } from './functions/health-check';
import { env } from '../env/cdk';
import { VideoStack } from './functions/video';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class VideoLinkedStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        const stackName = props.stackName ?? 'video-linked';
        const configuration: Configuration = {
            stackName: props.stackName ?? 'video-linked',
            removalPolicy: env.isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
            environment: {
                STACK_NAME: stackName,
                NODE_ENV: env.NODE_ENV,
                REGION: env.REGION,
                S3_MAIN_PREFIX: env.S3_MAIN_PREFIX,
            },
        };

        // init base resource
        const baseResources = new BaseResources(this, 'baseResources', { configuration });
        configuration.environment.S3_BUCKET_NAME = baseResources.s3.s3Bucket.bucketName;

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
        new VideoStack(this, 'videoStack', applicationProps);
    }
}
