import { GraphQLObjectType, GraphQLString } from 'graphql';

export const Posts = new GraphQLObjectType({
  name: 'posts',
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
