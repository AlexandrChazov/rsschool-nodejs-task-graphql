import { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';

export const Profiles = new GraphQLObjectType({
  name: 'profiles',
  fields: {
    id: {
      type: GraphQLString,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  },
});
