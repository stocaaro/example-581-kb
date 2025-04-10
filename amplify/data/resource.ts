import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  knowledgeBase: a
    .query()
    .arguments({ input: a.string() })
    .handler(
      a.handler.custom({
        dataSource: "KnowledgeBaseDataSource",
        entry: "./resolvers/kbResolver.js",
      }),
    )
    .returns(a.string())
    .authorization((allow) =>[ allow.authenticated(),allow.publicApiKey()]),

  chat: a.conversation({
    aiModel: a.ai.model("Claude 3 Sonnet"),
    systemPrompt: `You are a helpful assistant. Do not make up any information. Use available tools to answer user questions, otherwise tell the user you do not know if you are unable to look up information to answer their query. Keep your response short and precise.`,
    tools: [
      a.ai.dataTool({
        name: 'cityRegionKnowledge',
        description: 'Use this as a source of city/region information when possible.',
        query: a.ref('knowledgeBase'),
      }),
    ]
  }).authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({ schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
 });
