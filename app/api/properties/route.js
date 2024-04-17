import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import cloudinary from '@/config/cloudinary';

// GET /api/properties
export const GET = async (request) => {
	try {
		await connectDB();

		//await from Property model
		const properties = await Property.find({}); // with .find method, we want to find ALL properties using empty object

		return new Response(JSON.stringify(properties, { status: 200 }));
	} catch (error) {
		console.log(error);
		return new Response('something went wrong', { status: 500 });
	}
};

// export const GET = async (request) => {
// 	try {
// 		return new Response('Hello World', { status: 200 });
// 	} catch (error) {
// 		console.log(error);
// 		return new Response('something went wrong', { status: 500 });
// 	}
// };

// POST /api/properties
export const POST = async (request) => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.userId) {
			return new Response('User ID is required', { status: 401 });
		}

		const { userId } = sessionUser;

		const formData = await request.formData();

		// Access all values from amenities and images
		const amenities = formData.getAll('amenities'); // since it's an array, we use getAll()
		const images = formData
			.getAll('images')
			.filter((image) => image.name !== ''); // we need to filter to make sure that image is not empty

		// Create propertyData object for database
		const propertyData = {
			type: formData.get('type'),
			name: formData.get('name'),
			description: formData.get('description'),
			location: {
				street: formData.get('location.street'),
				city: formData.get('location.city'),
				state: formData.get('location.state'),
				zipcode: formData.get('location.zipcode'),
			},
			beds: formData.get('beds'),
			baths: formData.get('baths'),
			square_feet: formData.get('square_feet'),
			amenities,
			rates: {
				nightly: formData.get('rates.nightly'),
				weekly: formData.get('rates.weekly'),
				monthly: formData.get('rates.monthly'),
			},
			seller_info: {
				name: formData.get('seller_info.name'),
				email: formData.get('seller_info.email'),
				phone: formData.get('seller_info.phone'),
			},
			owner: userId,
			// images, // we don't need this... upload to cloudinary first, we receive the url, then we save the url to db
		};

		// Upload image(s) to Cloudinary
		// NOTE: this will be an array of strings, not an array of Promises
		// So imageUploadPromises has been changed to imageUrls to more
		// declaratively represent it's type.

		const imageUrls = [];

		for (const imageFile of images) {
			const imageBuffer = await imageFile.arrayBuffer();
			const imageArray = Array.from(new Uint8Array(imageBuffer));
			const imageData = Buffer.from(imageArray);

			// Convert the image data to base64
			const imageBase64 = imageData.toString('base64');

			// Make request to upload to Cloudinary
			const result = await cloudinary.uploader.upload(
				`data:image/png;base64,${imageBase64}`,
				{ folder: 'propertypulse' },
			);
			imageUrls.push(result.secure_url);
		}

		// NOTE: here there is no need to await the resolution of
		// imageUploadPromises as it's not an array of Promises it's an array of strings, additionally we shoult not await on every iteration of our loop

		propertyData.images = imageUrls;

		const newProperty = new Property(propertyData); // new Property - model
		await newProperty.save();

		return Response.redirect(
			`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`,
		);

		// return new Response(
		// 	JSON.stringify({ message: 'Success' }, { status: 200 }),
		// );
	} catch (error) {
		return new Response('Something went wrong', { status: 500 });
	}
};
