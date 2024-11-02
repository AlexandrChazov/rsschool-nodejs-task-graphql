import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { PrismaClient } from '@prisma/client';

import { MemberTypeId, MemberTypes } from './schemas/MemberTypes.js';
import { Posts } from './schemas/Posts.js';
import { Profiles } from './schemas/Profiles.js';
import { Users } from './schemas/Users.js';
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
        type: new GraphQLList(MemberTypes),
        resolve: async function (_a, _b, { prisma }: { prisma: PrismaClient }) {
          return prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberTypes,
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
        type: new GraphQLList(Posts),
        resolve: async function (_a, _b, { prisma }: { prisma: PrismaClient }) {
          return prisma.post.findMany();
        },
      },
      post: {
        type: Posts,
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
        type: new GraphQLList(Users),
        resolve: async function (_a, _b, { prisma }: { prisma: PrismaClient }) {
          return prisma.user.findMany();
        },
      },
      user: {
        type: Users,
        args: {
          id: { type: UUIDType },
        },
        resolve: async function (
          _a,
          { id }: { id: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.user.findUnique({ where: { id } });
        },
      },
      profiles: {
        type: new GraphQLList(Profiles),
        resolve: async function (_a, _b, { prisma }: { prisma: PrismaClient }) {
          return prisma.profile.findMany();
        },
      },
      profile: {
        type: Profiles,
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
