import { GraphQLFloat, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: UUIDType },
    balance: { type: GraphQLFloat },
  },
});
