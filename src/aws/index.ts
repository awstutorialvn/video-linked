import { config, DynamoDB } from 'aws-sdk';
import { region } from '..//configuration';

config.update({ region });

export { DynamoDB };
