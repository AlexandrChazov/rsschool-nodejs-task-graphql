import { GraphQLObjectType, GraphQLString } from 'graphql';

export const Post = new GraphQLObjectType({
  name: 'post',
  fields: {
    id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  },
});
