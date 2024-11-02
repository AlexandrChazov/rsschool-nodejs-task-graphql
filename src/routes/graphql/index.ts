import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { PrismaClient } from '@prisma/client';

import { MemberTypeId, MemberType } from './schemas/MemberType.js';
import { Post } from './schemas/Post.js';
import { Profile } from './schemas/Profile.js';
import { User } from './schemas/User.js';
import { UUIDType } from './types/uuid.js';
import { CreatePostInput } from './types/CreatePostInput.js';
import { CreateUserInput } from './types/CreateUserInput.js';
import { CreateProfileInput } from './types/CreateProfileInput.js';
import { ChangePostInput } from './types/ChangePostInput.js';
import { ChangeUserInput } from './types/ChangeUserInput.js';
import { ChangeProfileInput } from './types/ChangeProfileInput.js';

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
    name: 'Queries',
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
  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      createPost: {
        type: Post,
        args: {
          dto: { type: CreatePostInput },
        },
        resolve: async function (
          _,
          { dto }: { dto: { title: string; content: string; authorId: string } },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.post.create({ data: dto });
        },
      },
      deletePost: {
        type: GraphQLBoolean,
        args: {
          id: { type: UUIDType },
        },
        resolve: async function (
          _,
          { id }: { id: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          await prisma.post.delete({ where: { id } });
        },
      },
      changePost: {
        type: Post,
        args: {
          id: { type: UUIDType },
          dto: { type: ChangePostInput },
        },
        resolve: async function (
          _,
          {
            dto,
            id,
          }: { dto: { title: string; content: string; authorId: string }; id: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.post.update({ data: dto, where: { id } });
        },
      },
      createUser: {
        type: User,
        args: {
          dto: { type: CreateUserInput },
        },
        resolve: async function (
          _,
          { dto }: { dto: { name: string; balance: number } },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.user.create({ data: dto });
        },
      },
      deleteUser: {
        type: GraphQLBoolean,
        args: {
          id: { type: UUIDType },
        },
        resolve: async function (
          _,
          { id }: { id: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          await prisma.user.delete({ where: { id } });
        },
      },
      changeUser: {
        type: User,
        args: {
          id: { type: UUIDType },
          dto: { type: ChangeUserInput },
        },
        resolve: async function (
          _,
          { dto, id }: { dto: { name: string; balance: number }; id: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.user.update({ data: dto, where: { id } });
        },
      },
      createProfile: {
        type: Profile,
        args: {
          dto: { type: CreateProfileInput },
        },
        resolve: async function (
          _,
          {
            dto,
          }: {
            dto: {
              isMale: boolean;
              yearOfBirth: number;
              userId: string;
              memberTypeId: string;
            };
          },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.profile.create({ data: dto });
        },
      },
      deleteProfile: {
        type: GraphQLBoolean,
        args: {
          id: { type: UUIDType },
        },
        resolve: async function (
          _,
          { id }: { id: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          await prisma.profile.delete({ where: { id } });
        },
      },
      changeProfile: {
        type: Profile,
        args: {
          id: { type: UUIDType },
          dto: { type: ChangeProfileInput },
        },
        resolve: async function (
          _,
          {
            dto,
            id,
          }: {
            dto: {
              isMale: boolean;
              yearOfBirth: number;
              userId: string;
              memberTypeId: string;
            };
            id: string;
          },
          { prisma }: { prisma: PrismaClient },
        ) {
          return prisma.profile.update({ data: dto, where: { id } });
        },
      },
    },
  }),
});

export default plugin;
