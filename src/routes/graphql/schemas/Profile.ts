import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { MemberType } from './MemberType.js';
import DataLoader from 'dataloader';
import { Post as PostModel } from '.prisma/client';

export const Profile = new GraphQLObjectType({
  name: 'profile',
  fields: {
    id: {
      type: UUIDType,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    memberType: {
      type: MemberType,
      resolve: async function (
        profile: { memberTypeId: string },
        _args,
        {
          memberTypesLoader,
        }: { memberTypesLoader: DataLoader<string, PostModel | null> },
      ) {
        return await memberTypesLoader.load(profile.memberTypeId);
      },
    },
  },
});
