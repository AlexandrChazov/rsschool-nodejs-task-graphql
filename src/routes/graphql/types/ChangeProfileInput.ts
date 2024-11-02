import { GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLBoolean, GraphQLInt } from 'graphql/index.js';
import { MemberTypeId } from '../schemas/MemberType.js';

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
  },
});
