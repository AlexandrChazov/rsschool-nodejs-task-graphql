import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Profile } from './Profile.js';
import { Post } from './Post.js';
import { PrismaClient } from '@prisma/client';

export const User: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
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
    },
    posts: {
      type: new GraphQLList(Post),
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async function (
        { id }: { id: string },
        _b,
        { prisma }: { prisma: PrismaClient },
      ) {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id,
              },
            },
          },
          include: {
            subscribedToUser: true,
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async function (
        { id }: { id: string },
        _b,
        { prisma }: { prisma: PrismaClient },
      ) {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id,
              },
            },
          },
          include: {
            userSubscribedTo: true,
          },
        });
      },
    },
  }),
});
