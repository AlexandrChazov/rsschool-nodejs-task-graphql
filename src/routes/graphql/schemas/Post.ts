import { GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const Post = new GraphQLObjectType({
  name: 'post',
  fields: {
    id: {
      type: UUIDType,
    },
    title: {
      type: UUIDType,
    },
    content: {
      type: UUIDType,
    },
    authorId: {
      type: UUIDType,
    },
  },
});
