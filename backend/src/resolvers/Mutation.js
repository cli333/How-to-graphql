const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils.js');

async function signup(parent, args, ctx, info) {
	const password = await bcrypt.hash(args.password, 10);
	const user = await ctx.prisma.createUser({ ...args, password });
	const token = jwt.sign({ userId: user.id }, APP_SECRET);

	// the auth payload
	return {
		token,
		user,
	};
}

async function login(parent, args, ctx, info) {
	const user = await ctx.prisma.user({ email: args.email });
	if (!user) throw new Error('No such user found!');

	const valid = await bcrypt.compare(args.password, user.password);
	if (!valid) throw new Error('Invalid password!');

	const token = jwt.sign({ userId: user.id }, APP_SECRET);

	return {
		token,
		user,
	};
}

function post(parent, args, ctx, info) {
	const userId = getUserId(ctx);
	return ctx.prisma.createLink({
		url: args.url,
		description: args.description,
		postedBy: { connect: { id: userId } },
	});
}

function updateLink(parent, args, ctx, info) {
	const { url, description, id } = args;
	return ctx.prisma.updateLink({ data: { url, description }, where: { id } });
}

function deleteLink(parent, args, ctx, info) {
	const { id } = args;
	return ctx.prisma.deleteLink({ id });
}

async function vote(parent, args, ctx, info) {
	const userId = getUserId(ctx);

	const linkExists = await ctx.prisma.$exists.vote({
		user: { id: userId },
		link: { id: args.linkId },
	});

	if (linkExists) throw new Error(`Already voted for ${args.linkId}`);

	return ctx.prisma.createVote({
		user: { connect: { id: userId } },
		link: { connect: { id: args.linkId } },
	});
}

module.exports = { signup, login, post, updateLink, deleteLink, vote };
