import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Profile } from './Profile.js';
import { Post } from './Post.js';

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
    profile: {
      type: Profile,
    },
    posts: {
      type: new GraphQLList(Post),
    },
  },
});
