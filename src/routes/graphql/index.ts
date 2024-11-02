import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { PrismaClient } from '@prisma/client';

import { MemberTypeId, MemberType } from './schemas/MemberType.js';
import { Post } from './schemas/Post.js';
import { Profile } from './schemas/Profile.js';
import { User } from './schemas/User.js';
import { UUIDType } from './types/uuid.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      return graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });
    },
  });
};

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'BasicSchema',
    fields: {
      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async function (_a, _b, { prisma }: { prisma: PrismaClient }) {
          return prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberType,
        args: {
          id: { type: MemberTypeId },
        },
        resolve: async function (
          _,
          { id }: { id: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.memberType.findUnique({ where: { id } });
        },
      },
      posts: {
        type: new GraphQLList(Post),
        resolve: async function (_a, _b, { prisma }: { prisma: PrismaClient }) {
          return prisma.post.findMany();
        },
      },
      post: {
        type: Post,
        args: {
          id: { type: UUIDType },
        },
        resolve: async function (
          _a,
          { id }: { id: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.post.findUnique({ where: { id } });
        },
      },
      users: {
        type: new GraphQLList(User),
        resolve: async function (_a, _b, { prisma }: { prisma: PrismaClient }) {
          return prisma.user.findMany({
            include: { profile: { include: { memberType: true } }, posts: true },
          });
        },
      },
      user: {
        type: User,
        args: {
          id: { type: UUIDType },
        },
        resolve: async function (
          _a,
          { id }: { id: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.user.findUnique({
            where: { id },
            include: { profile: { include: { memberType: true } }, posts: true },
          });
        },
      },
      profiles: {
        type: new GraphQLList(Profile),
        resolve: async function (_a, _b, { prisma }: { prisma: PrismaClient }) {
          return prisma.profile.findMany();
        },
      },
      profile: {
        type: Profile,
        args: {
          id: { type: UUIDType },
        },
        resolve: async function (
          _a,
          { id }: { id: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.profile.findUnique({ where: { id } });
        },
      },
    },
  }),
});

export default plugin;
