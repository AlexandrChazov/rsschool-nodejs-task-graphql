import { GraphQLFloat, GraphQLObjectType, GraphQLString } from 'graphql';

export const Users = new GraphQLObjectType({
  name: 'Users',
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
