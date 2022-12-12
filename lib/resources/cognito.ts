import * as cdk from 'aws-cdk-lib';
import { NestedStack, NestedStackProps, RemovalPolicy } from 'aws-cdk-lib';
import { AccountRecovery, UserPool, UserPoolClient, UserPoolClientIdentityProvider } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { env } from '../../env';

export class CognitoResource extends NestedStack {
    public userPool: UserPool;

    public userPoolClient: UserPoolClient;

    public constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id, props);
        const stackName = env.isProd ? env.STACK_NAME : `${env.STAGE_NAME}-${env.STACK_NAME}`;
        // User Pool
        const userPoolName = `${stackName}-userPool`;
        this.userPool = new UserPool(this, userPoolName, {
            userPoolName: userPoolName,
            selfSignUpEnabled: true,
            standardAttributes: {
                email: { required: true, mutable: true },
                phoneNumber: { required: false },
            },
            signInCaseSensitive: false,
            autoVerify: { email: true },
            signInAliases: { email: true },
            accountRecovery: AccountRecovery.EMAIL_ONLY,
            removalPolicy: env.isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
            passwordPolicy: {
                minLength: 6,
                requireLowercase: true,
                requireDigits: true,
                requireUppercase: true,
                requireSymbols: true,
            },
        });

        // User Pool Client
        const userPoolClientName = `${stackName}-userPool-client`;
        this.userPoolClient = new UserPoolClient(this, userPoolClientName, {
            userPoolClientName: userPoolClientName,
            userPool: this.userPool,
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userSrp: true,
            },
            supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
        });

        // 👇 Outputs
        new cdk.CfnOutput(this, 'userPoolId', {
            value: this.userPool.userPoolId,
        });
        new cdk.CfnOutput(this, 'userPoolClientId', {
            value: this.userPoolClient.userPoolClientId,
        });
    }
}
