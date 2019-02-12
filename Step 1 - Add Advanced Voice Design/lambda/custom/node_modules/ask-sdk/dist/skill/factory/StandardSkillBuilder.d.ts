import { BaseSkillBuilder } from 'ask-sdk-core';
import { PartitionKeyGenerator } from 'ask-sdk-dynamodb-persistence-adapter';
import { DynamoDB } from 'aws-sdk';
/**
 * An interface containing help functions to build a {@link Skill} with dynamoDB configuration options.
 */
export interface StandardSkillBuilder extends BaseSkillBuilder {
    withTableName(tableName: string): this;
    withAutoCreateTable(autoCreateTable: boolean): this;
    withPartitionKeyGenerator(partitionKeyGenerator: PartitionKeyGenerator): this;
    withDynamoDbClient(customDynamoDBClient: DynamoDB): this;
}
