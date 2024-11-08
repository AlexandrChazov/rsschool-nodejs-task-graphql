import { GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: UUIDType },
    content: { type: UUIDType },
    authorId: { type: UUIDType },
  },
});
