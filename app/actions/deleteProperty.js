'use server';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';

async function deleteProperty(propertyId) {
	// Check user session
	const sessionUser = await getSessionUser();
	if (!sessionUser || !sessionUser.userId) {
		throw new Error('User ID is required');
	}
	const { userId } = sessionUser;

	// Get Property
	const property = await Property.findById(propertyId); //model
	// Check Property
	if (!property) throw new Error('Property Not Found');

	// Verify ownership
	if (property.owner.toString() !== userId) {
		throw new Error('Unauthorized');
	}

	// Extract public ID from image URLs
	// i.e. https://res.cloudinary.com/mookat/image/upload/v1713355941/propertypulse/a6jtr9pecxrhza0kjii4.png
	const publicIds = property.images.map((imageUrl) => {
		const parts = imageUrl.split('/');
		return parts.at(-1).split('.').at(0);
	});

	// Delete images from Cloudinary
	if (publicIds.length > 0) {
		for (let publicId of publicIds) {
			await cloudinary.uploader.destroy('propertypulse/' + publicId);
		}
	}

	await property.deleteOne(); // deleteOne from mongoDB

	revalidatePath('/', 'layout');
}

export default deleteProperty;
