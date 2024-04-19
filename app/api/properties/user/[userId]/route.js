import connectDB from '@/config/database';
import Property from '@/models/Property';

// GET /api/properties/user/:userId
export const GET = async (request, { params }) => {
	try {
		await connectDB();
		const userId = params.userId; // params.userId - name of folder

		if (!userId) {
			return new Response('User ID is required', { status: 400 });
		}

		//await from Property model
		const properties = await Property.find({ owner: userId }); // with .find method, we want to find owner

		return new Response(JSON.stringify(properties, { status: 200 }));
	} catch (error) {
		console.log(error);
		return new Response('something went wrong', { status: 500 });
	}
};
