function newLinkSubscribe(parent, args, ctx, info) {
	return ctx.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node();
}

function newVoteSubscribe(parent, args, ctx, info) {
	return ctx.prisma.$subscribe.vote({ mutation_in: ['CREATED'] }).node();
}

// Subscription resolvers are wrapped in an object and need to provided a value for subscribe field
// a resolve field must be provided that returns the data from the async iterator

const newLink = {
	subscribe: newLinkSubscribe,
	resolve: payload => {
		return payload;
	},
};

const newVote = {
	subscribe: newVoteSubscribe,
	resolve: payload => {
		return payload;
	},
};

module.exports = { newLink, newVote };
