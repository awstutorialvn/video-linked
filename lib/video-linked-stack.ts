import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { BaseResources } from './resources';
import { ApplicationProps } from './interfaces/application';
import { HealthCheck } from './health-check';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class AppResources extends cdk.NestedStack {
	constructor(scope: Construct, id: string, props: ApplicationProps) {
		super(scope, id, props);

		new HealthCheck(this, 'healthCheck', props);
	};
}

export class VideoLinkedStack extends cdk.Stack {
  	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    	super(scope, id, props);

		// init base resource
		const baseResources = new BaseResources(this, 'baseResources');
		new AppResources(this, 'appResources', { 
			baseResources
		})
  }
}
