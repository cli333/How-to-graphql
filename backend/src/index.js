const { GraphQLServer } = require('graphql-yoga');

const typeDefs = `
    type Query {
        info: String!
    }
`;

const resolvers = {
	Query: {
		info: () => `Let's get this working!`,
	},
};

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => console.log('Server is running on http://localhost:4000'));
