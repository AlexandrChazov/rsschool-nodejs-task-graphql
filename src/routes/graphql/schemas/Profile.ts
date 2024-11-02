import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { MemberType } from './MemberType.js';

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
    },
  },
});
