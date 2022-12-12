import * as cdk from 'aws-cdk-lib';
import { BaseResources } from '../resources';

export interface Configuration {
    stackName: string;
}

export interface ResourcesProps extends cdk.NestedStackProps {
    configuration: Configuration;
    baseResources: BaseResources;
}

export type ApplicationProps = ResourcesProps;
