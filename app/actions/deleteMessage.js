'use server';
import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function deleteProperty(messageId) {
	// Check user session
	const sessionUser = await getSessionUser();
	if (!sessionUser || !sessionUser.userId) {
		throw new Error('User ID is required');
	}
	const { userId } = sessionUser;

	const message = await Message.findById(messageId);

	// Verify ownership
	if (message.recipient.toString() !== userId) {
		throw new Error('Unauthorized');
	}

	await message.deleteOne();

	revalidatePath('/', 'layout');
}

export default deleteProperty;
