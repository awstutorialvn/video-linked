import * as cdk from 'aws-cdk-lib';
import { AppResources, BaseResources } from '../resources';

export interface Configuration {
    stackName: string;
    environment: { [key: string]: string };
}

export interface NestedResourcesProps extends cdk.NestedStackProps {
    configuration: Configuration;
}

export interface ApplicationResourcesProps extends NestedResourcesProps {
    baseResources: BaseResources;
}

export interface ApplicationProps extends ApplicationResourcesProps {
    appResources: AppResources;
}
