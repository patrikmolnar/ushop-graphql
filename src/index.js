const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const { processUpload } = require('./fileUpload')


const resolvers = {
  Query: {
    reviews: (_, args, context, info) => {
      return context.prisma.query.reviewses(info)
    },
    // Return all documents

    // documents: (_, args, context, info) => {
    //   return context.prisma.query.documents(info)
    // },

    // Return documents filtered by country code 
    documents: (_, args, context, info) => {
      return context.prisma.query.documents({ where: { country: args.where.country } }, info)
    },
    campaigns: (_, args, context, info) => {
      return context.prisma.query.campaigns(info)
    },
  },
  Mutation: {
    createCampaign: (_, args, context, info) => {
      return context.prisma.mutation.createCampaign(
        {
          data: {
            page1: args.page1,
            page2: args.page2,
            page3: args.page3,
            checkout1: args.checkout1,
            checkout2: args.checkout2,
            checkout3: args.checkout3
          },
        },
        info,
      )
    },
    updatePage1: (_, args, context, info) => {
      return context.prisma.mutation.updateCampaign(
        {
          where: { id: args.id },
          data: { page1: args.page1 },
        },
        info,
      )
    },
    updatePage2: (_, args, context, info) => {
      return context.prisma.mutation.updateCampaign(
        {
          where: { id: args.id },
          data: { page2: args.page2 },
        },
        info,
      )
    },
    updatePage3: (_, args, context, info) => {
      return context.prisma.mutation.updateCampaign(
        {
          where: { id: args.id },
          data: { page3: args.page3 },
        },
        info,
      )
    },
    updateCheckout1: (_, args, context, info) => {
      return context.prisma.mutation.updateCampaign(
        {
          where: { id: args.id },
          data: { checkout1: args.checkout1 },
        },
        info,
      )
    },
    updateCheckout2: (_, args, context, info) => {
      return context.prisma.mutation.updateCampaign(
        {
          where: { id: args.id },
          data: { checkout2: args.checkout2 },
        },
        info,
      )
    },
    updateCheckout3: (_, args, context, info) => {
      return context.prisma.mutation.updateCampaign(
        {
          where: { id: args.id },
          data: { checkout3: args.checkout3 },
        },
        info,
      )
    },
    createReviews: (_, args, context, info) => {
      return context.prisma.mutation.createReviews(
        {
          data: {
            title: args.title,
            body: args.body,
            name: args.name,
            ba_id: args.ba_id,
            country: args.country,
            product_id: args.product_id,
            rating: args.rating,
            isHidden: args.isHidden
          },
        },
        info,
      )
    },
    async createDocument(_, { file, filenameENG, country, filenameNative }, context, info) {
      return await processUpload(await file, context)
    },
    updateReviews(_, args, context, info) {
      return context.prisma.mutation.updateReviews(
        {
          where: { id: args.id },
          data: { isHidden: args.isHidden },
        },
        info,
      )
    },
    deleteDocument: (_, args, context, info) => {
      return context.prisma.mutation.deleteDocument({ where: { id: args.id } }, info)
    },
    deleteReviews: (_, args, context, info) => {
      return context.prisma.mutation.deleteReviews({ where: { id: args.id } }, info,)
    }
  },
  Subscription: {
    campaign: {
      subscribe: (_, args, context, info) => {
        return context.prisma.subscription.campaign(
          {
            where: {
              mutation_in: ['UPDATED'],
            },
          },
          info,
        )
      },
    },
  },
}

const options = {
  playground: '/playground',
}

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://revie-Publi-1B6K7WADR6O4Y-76537972.ap-northeast-1.elb.amazonaws.com/reviews/v1',
      debug: false,
    }),
  }),
})

server.start(options, () => console.log(`The server is running on http://localhost:4000`))