import { GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: UUIDType },
    content: { type: UUIDType },
  },
});
