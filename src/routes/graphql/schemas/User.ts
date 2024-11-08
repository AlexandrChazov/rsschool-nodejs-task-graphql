import { GraphQLFloat, GraphQLList, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Profile } from './Profile.js';
import { Post } from './Post.js';
import {
  PrismaClient,
  Post as PostModel,
  User as UserModel,
  Profile as ProfileModel,
} from '@prisma/client';
import DataLoader from 'dataloader';

export const User: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  //@ts-ignore
  fields: () => ({
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
      resolve: async (
        user: { id: string },
        _,
        { profileLoader }: { profileLoader: DataLoader<string, ProfileModel> },
      ) => {
        return await profileLoader.load(user.id);
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async function (
        user: { id: string },
        _args,
        {
          postsLoader,
        }: { postsLoader: DataLoader<string, PostModel | null>; prisma: PrismaClient },
      ) {
        return await postsLoader.load(user.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async function (
        user: { userSubscribedTo: { subscriberId: string; authorId: string }[] },
        _b,
        { userLoader }: { userLoader: DataLoader<string, UserModel> },
      ) {
        const subs = user.userSubscribedTo || [];
        return userLoader.loadMany(subs.map((sub) => sub.authorId));
      },
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async function (
        user: { subscribedToUser: { subscriberId: string; authorId: string }[] },
        _b,
        { userLoader }: { userLoader: DataLoader<string, UserModel> },
      ) {
        const subs = user.subscribedToUser || [];
        return userLoader.loadMany(subs.map((sub) => sub.subscriberId));
      },
    },
  }),
});
