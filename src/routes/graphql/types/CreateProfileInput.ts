import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeId } from '../schemas/MemberType.js';

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
  },
});
