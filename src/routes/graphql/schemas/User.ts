import { GraphQLFloat, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: UUIDType,
    },
    name: {
      type: UUIDType,
    },
    balance: {
      type: GraphQLFloat,
    },
  },
});
