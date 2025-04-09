import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  data,
});

const KnowledgeBaseDataSource =
  backend.data.resources.graphqlApi.addHttpDataSource(
    "KnowledgeBaseDataSource",
    `https://bedrock-agent-runtime.${cdk.Stack.of(backend.data).region}.amazonaws.com`,
    {
      authorizationConfig: {
        signingRegion: cdk.Stack.of(backend.data).region,
        signingServiceName: "bedrock",
      },
    },
  );

// Using wildcard for knowledge base ID - replace with specific ID when ready for production
KnowledgeBaseDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      `arn:aws:bedrock:${cdk.Stack.of(backend.data).region}:${cdk.Stack.of(backend.data).account}:knowledge-base/*`
    ],
    actions: ["bedrock:Retrieve"],
  }),
);
