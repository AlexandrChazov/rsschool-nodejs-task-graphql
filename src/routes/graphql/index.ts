import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  validate,
  parse,
} from 'graphql';
import {
  PrismaClient,
  User as UserModel,
  Post as PostModel,
  Profile as ProfileModel,
  MemberType as MemberTypeModel,
} from '@prisma/client';
import depthLimit from 'graphql-depth-limit';

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
import DataLoader from 'dataloader';
import { userLoader } from './loaders/userLoader.js';
import { profileIdLoader, profileLoader } from './loaders/profileLoader.js';
import { postLoader, postsLoader } from './loaders/postLoader.js';
import { memberTypeLoader, memberTypesLoader } from './loaders/memberTypeLoader.js';

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
      const errors = validate(schema, parse(query), [depthLimit(5)]);
      if (errors.length > 0) {
        return { errors };
      }

      return graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: {
          memberTypeLoader: memberTypeLoader(prisma),
          memberTypesLoader: memberTypesLoader(prisma),
          postLoader: postLoader(prisma),
          postsLoader: postsLoader(prisma),
          profileLoader: profileLoader(prisma),
          profileIdLoader: profileIdLoader(prisma),
          userLoader: userLoader(prisma),
          prisma,
        },
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
        //@ts-ignore
        resolve: async (
          _,
          { id }: { id: string },
          {
            memberTypesLoader,
          }: { memberTypesLoader: DataLoader<string, MemberTypeModel> },
        ) => {
          return await memberTypesLoader.load(id);
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
        //@ts-ignore
        resolve: async (
          _,
          { id }: { id: string },
          { postLoader }: { postLoader: DataLoader<string, PostModel> },
        ) => {
          return await postLoader.load(id);
        },
      },
      users: {
        type: new GraphQLList(User),
        resolve: async function (_a, _b, { prisma }: { prisma: PrismaClient }) {
          return prisma.user.findMany();
        },
      },
      user: {
        type: User,
        args: {
          id: { type: UUIDType },
        },
        //@ts-ignore
        resolve: async (
          _,
          { id }: { id: string },
          { userLoader }: { userLoader: DataLoader<string, UserModel> },
        ) => {
          return await userLoader.load(id);
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
        //@ts-ignore
        resolve: async (
          _,
          { id }: { id: string },
          { profileIdLoader }: { profileIdLoader: DataLoader<string, ProfileModel> },
        ) => {
          return await profileIdLoader.load(id);
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
      subscribeTo: {
        type: GraphQLBoolean,
        args: {
          userId: { type: UUIDType },
          authorId: { type: UUIDType },
        },
        resolve: async function (
          _,
          { userId, authorId }: { userId: string; authorId: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          await prisma.subscribersOnAuthors.create({
            data: {
              subscriberId: userId,
              authorId,
            },
          });
        },
      },
      unsubscribeFrom: {
        type: GraphQLBoolean,
        args: {
          userId: { type: UUIDType },
          authorId: { type: UUIDType },
        },
        resolve: async function (
          _,
          { userId, authorId }: { userId: string; authorId: string },
          { prisma }: { prisma: PrismaClient },
        ) {
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId,
              },
            },
          });
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
