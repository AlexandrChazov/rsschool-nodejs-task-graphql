import { GraphQLEnumType, GraphQLObjectType, GraphQLString } from 'graphql/index.js';

export const MemberTypeId = new GraphQLEnumType({
  // это имя указывается в запросе как тип переменной - $memberTypeId: MemberTypeId!
  name: 'MemberTypeId',
  values: {
    BASIC: {
      value: 'BASIC',
    },
    BUSINESS: {
      value: 'BUSINESS',
    },
  },
});

export const MemberTypes = new GraphQLObjectType({
  name: 'memberType',
  fields: {
    id: {
      type: MemberTypeId,
    },
    discount: {
      type: GraphQLString,
    },
    postsLimitPerMonth: {
      type: GraphQLString,
    },
  },
});
