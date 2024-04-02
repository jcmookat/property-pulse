import connectDB from '@/config/database';
import Property from '@/models/Property';

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
