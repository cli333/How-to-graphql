const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

// dummy data
// let links = [
// 	{
// 		id: 'link-0',
// 		url: 'www.howtographql.com',
// 		description: 'Fullstack tutorial for GraphQL',
// 	},
// ];

// let idCount = links.length;

// const typeDefs = `
//     type Query {
//         info: String!
//         feed: [Link]!
//     }

//     type Mutation {
//         post(url: String!, description: String!): Link!
//     }

//     type Link {
//         id: ID!
//         description: String!
//         url: String!
//     }
// `;

const resolvers = {
	Query: {
		info: () => `Let's get going!`,
		feed: (parent, args, ctx, info) => ctx.prisma.links(),
		// link: (parent, args, ctx, info) => {
		// 	return links.filter(link => link.id === args.id)[0];
		// },
	},
	Mutation: {
		post: (parent, args, ctx, info) => {
			return ctx.prisma.createLink({
				url: args.url,
				description: args.description,
			});
		},
		// updateLink: (parent, args, ctx, info) => {
		// 	const { description, url } = args;

		// 	let foundLink = links.find(link => link.id === args.id);

		// 	if (!foundLink) return 'No link found!';
		// 	if (description) foundLink.description = description;
		// 	if (url) foundLink.url = url;
		// 	return foundLink;
		// },
		// deleteLink: (parent, args, ctx, info) => {
		// 	let foundIdx = links.findIndex(link => link.id === args.id);
		// 	let foundLink = links[foundIdx];
		// 	links.splice(foundIdx, 1);
		// 	return foundLink;
		// },
	},
	// Link: {
	// 	id: (parent, args, ctx, info) => parent.id,
	// 	description: (parent, args, ctx, info) => parent.description,
	// 	url: (parent, args, ctx, info) => parent.url,
	// },
};

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: { prisma },
});

server.start(() => console.log('Server is running on http://localhost:4000'));
