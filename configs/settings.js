// This file merges the secrets, general and microservices files into one object
// This is necessary to avoid changing the code that treats them separately
import { Microservices } from './microservices';
import secrets from './secrets';
import general from './general';

export default {
    Microservices,
    ...secrets,
    ...general,
};
