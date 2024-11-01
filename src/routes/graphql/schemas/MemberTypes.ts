import { GraphQLEnumType, GraphQLObjectType, GraphQLString } from 'graphql/index.js';

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  description: 'BASIC | BUSINESS',
  values: {
    BASIC: {
      value: 0,
      description: 'BASIC',
    },
    BUSINESS: {
      value: 1,
      description: 'BUSINESS',
    },
  },
});

export const MemberTypes = new GraphQLObjectType({
  name: 'memberType',
  fields: {
    id: {
      type: GraphQLString,
    },
    discount: {
      type: GraphQLString,
    },
    postsLimitPerMonth: {
      type: GraphQLString,
    },
  },
});
