import { env } from '../../env';

const stackName = env.isProd ? env.STACK_NAME : `${env.STAGE_NAME}-${env.STACK_NAME}`;
const region = env.REGION;

export { region, stackName };
