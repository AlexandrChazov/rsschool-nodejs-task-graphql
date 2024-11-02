import { GraphQLFloat, GraphQLObjectType, GraphQLString } from 'graphql';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  },
});
