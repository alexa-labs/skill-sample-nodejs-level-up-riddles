import { RequestEnvelope } from 'ask-sdk-model';
/**
 * Type definition of function used by {@link DynamoDbPersistenceAdapter} to extract attributes id from {@link RequestEnvelope}.
 */
export declare type PartitionKeyGenerator = (requestEnvelope: RequestEnvelope) => string;
/**
 * Object containing implementations of {@link PartitionKeyGenerator}.
 */
export declare const PartitionKeyGenerators: {
    userId(requestEnvelope: RequestEnvelope): string;
    deviceId(requestEnvelope: RequestEnvelope): string;
};
