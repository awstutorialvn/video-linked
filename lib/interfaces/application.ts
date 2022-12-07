import * as cdk from 'aws-cdk-lib';
import { BaseResources } from '../resources';

export interface ApplicationProps extends cdk.NestedStackProps {
    baseResources: BaseResources
}