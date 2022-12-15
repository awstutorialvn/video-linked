import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NestedStack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NestedResourcesProps } from '../../interfaces/application';

import { env } from '../../../env';

export class DynamoDBResource extends NestedStack {
    public tables: {
        User: dynamodb.Table;
    };

    public constructor(scope: Construct, id: string, props: NestedResourcesProps) {
        super(scope, id, props);

        const stackName = props.configuration.stackName;
        const billingMode = dynamodb.BillingMode.PROVISIONED;
        const readCapacity = 5;
        const writeCapacity = 5;
        const pointInTimeRecovery = env.isProd ? true : false;
        const removalPolicy = env.isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY;
        const tableClass = env.isProd ? dynamodb.TableClass.STANDARD : dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS;

        // replicationRegions: ['us-east-1', 'us-east-2', 'us-west-1'],
        const tables = {
            User: new dynamodb.Table(this, `${stackName}_User`, {
                partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
                sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
                billingMode,
                readCapacity,
                writeCapacity,
                removalPolicy,
                pointInTimeRecovery,
                tableClass: tableClass,
                tableName: `${stackName}_User`,
            }),
        };
        this.tables = tables;

        // table.addLocalSecondaryIndex({
        //     indexName: 'statusIndex',
        //     sortKey: {name: 'status', type: dynamodb.AttributeType.STRING},
        //     projectionType: dynamodb.ProjectionType.ALL
        //  });

        // const readScaling = table.autoScaleReadCapacity({ minCapacity: 5, maxCapacity: 100 });

        // // Utilization based scaling
        // readScaling.scaleOnUtilization({ targetUtilizationPercent: 100, });

        // // Time based scaling
        // readScaling.scaleOnSchedule('ScaleUpAtsix', {
        // schedule: appscaling.Schedule.cron({ hour: '6', minute: '0' }),
        // minCapacity: 75,
        // });
        // const encryptionKey = new kms.Key(this, 'Key', {
        //     enableKeyRotation: true,
        //   });

        //   const table = new dynamodb.Table(this, 'MyTable', {
        //     partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        //     encryption: dynamodb.TableEncryption.CUSTOMER_MANAGED,
        //     encryptionKey,
        //   });
        // const stream = new kinesis.Stream(this, 'Stream');

        // const table = new dynamodb.Table(this, 'Table', {
        // partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        // kinesisStream: stream,
        // });
    }
}
