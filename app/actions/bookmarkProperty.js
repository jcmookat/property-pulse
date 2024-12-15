'use server';
import connectDB from '@/config/database';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

async function bookmarkProperty(propertyId) {
	await connectDB();
	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		throw new Error('User ID is required');
	}

	const { userId } = sessionUser;

	const user = await User.findById(userId);

	let isBookmarked = user.bookmarks.includes(propertyId);

	let message;

	if (isBookmarked) {
		// If already bookmarked, then remove
		//     Mongoose extend the Array class with various methods, including pull
		// https://mongoosejs.com/docs/5.x/docs/api/array.html#mongoosearray_MongooseArray-pull
		user.bookmarks.pull(propertyId);
		message = 'Bookmark removed';
		isBookmarked = false;
	} else {
		// If not bookmarked, then add
		user.bookmarks.push(propertyId);
		message = 'Bookmarked property';
		isBookmarked = true;
	}

	await user.save();

	revalidatePath('/properties/saved', 'page');

	return {
		message,
		isBookmarked,
	};
}

export default bookmarkProperty;
