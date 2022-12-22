import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { NestedStack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

import { env } from '../../env/cdk';
import { ApplicationProps } from '../interfaces/application';

// interface FunctionProps {
//     path: string;
//     method: 'GET' | 'POST' | 'PUT' | 'PATCH',
//     authorizerRequired: boolean;
//     nodejsFunctionProps: NodejsFunctionProps;
//     resourcePermissions: ((identity: IGrantable, objectsKeyPattern?: any) => Grant)[];
// };

export class VideoStack extends NestedStack {
    public constructor(scope: Construct, id: string, props: ApplicationProps) {
        super(scope, id, props);

        const appResources = props.appResources;
        const apiGateway = appResources.apiGateway;
        const api = apiGateway.api;
        const stackName = props.configuration.stackName;

        // const functionDefaultProps: NodejsFunctionProps  = {
        //     runtime: Runtime.NODEJS_16_X,
        //     environment: props.configuration.environment,
        //     bundling: {
        //         minify: env.isProduction,
        //         externalModules: [],
        //     },

        // }
        // const videoFunctions: FunctionProps[] = [
        //     {
        //         path: 'video/presigned-url/put-object',
        //         method: 'GET',
        //         resourcePermissions: [props.baseResources.s3.s3Bucket.grantPut],
        //         authorizerRequired: false,
        //         nodejsFunctionProps: {
        //             ...functionDefaultProps,
        //             functionName: `${stackName}-presigned-put-url`,
        //             handler: 'presignedPutUrlHandler',
        //             entry: path.join(__dirname, `../../src/api/video/index.ts`),
        //         }
        //     }
        // ];

        // videoFunctions.forEach((fun) => {
        //     const { nodejsFunctionProps, resourcePermissions, authorizerRequired } = fun;
        //     const nodeFunction = new NodejsFunction(this, nodejsFunctionProps.functionName!, nodejsFunctionProps);
        //     resourcePermissions.forEach(resourcePermission => resourcePermission(nodeFunction));
        //     const apiPathResources = fun.path.split('/');
        //     let apiResource = api.root;
        //     for (let i = 0; i < apiPathResources.length; i++) {
        //         const apiPathResource = apiPathResources[i];
        //         apiResource = apiResource.getResource(apiPathResource) ?? apiResource.addResource(apiPathResource);
        //     }
        //     apiResource.addMethod(fun.method, new apigateway.LambdaIntegration(nodeFunction, { proxy: true }), {
        //         authorizer: authorizerRequired ? apiGateway.cognitoAuthorizer : undefined
        //     })
        // });

        const presignedPutUrlFunctionName = `${stackName}-presigned-put-url`;
        const presignedPutUrlFunction = new NodejsFunction(this, presignedPutUrlFunctionName, {
            functionName: presignedPutUrlFunctionName,
            runtime: Runtime.NODEJS_16_X,
            handler: 'presignedPutUrlHandler',
            entry: path.join(__dirname, `../../src/api/video/index.ts`),
            bundling: {
                minify: env.isProduction,
                externalModules: [],
            },
            environment: props.configuration.environment,
        });

        props.baseResources.s3.s3Bucket.grantPut(presignedPutUrlFunction);
        const video = api.root.getResource('video') ?? api.root.addResource('video');
        const videoPresignedUrl = video.getResource('presigned-url') ?? video.addResource('presigned-url');
        const videoPresignedPutUrl =
            videoPresignedUrl.getResource('put-object') ?? videoPresignedUrl.addResource('put-object');

        // 👇 integrate GET /health-check with healthCheckFunc
        videoPresignedPutUrl.addMethod(
            'GET',
            new apigateway.LambdaIntegration(presignedPutUrlFunction, { proxy: true }),
            {
                authorizer: apiGateway.cognitoAuthorizer,
            },
        );
    }
}
