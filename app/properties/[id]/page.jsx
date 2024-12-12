import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import PropertyHeaderImage from '@/components/PropertyHeaderImage';
import PropertyDetails from '@/components/PropertyDetails';
import ShareButton from '@/components/ShareButton';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import PropertyImages from '@/components/PropertyImages';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import BookmarkButton from '@/property-pulse-main/components/BookmarkButton';
import ContactForm from '@/components/ContactForm';

const PropertyPage = async ({ params }) => {
	// NOTE: No need for making a fetch request here to our API routes, we can
	// simply make this component a server component and query the DB directly.
	// Making a fetch request is an unnecessary additional step.

	await connectDB();

	// query the property in the DB
	const propertyDoc = await Property.findById(params.id).lean();

	// convert the document to a plain js object so we can pass to client
	// components
	const property = convertToSerializeableObject(propertyDoc); //single object, no need to .map

	if (!property) {
		return (
			<h1 className='text-center text-2xl font-bold mt-10'>
				Property Not Found
			</h1>
		);
	}

	return (
		<>
			<PropertyHeaderImage image={property.images[0]} />
			<section>
				<div className='container m-auto py-6 px-6'>
					<Link
						href='/properties'
						className='text-blue-500 hover:text-blue-600 flex items-center'>
						<FaArrowLeft className='mr-2' />
						Back to Properties
					</Link>
				</div>
			</section>
			<section className='bg-blue-50'>
				<div className='container m-auto py-10 px-6'>
					<div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
						<PropertyDetails property={property} />
						<aside className='space-y-4'>
							<BookmarkButton property={property} />
							<ShareButton property={property} />
							<ContactForm property={property} />
						</aside>
					</div>
				</div>
			</section>
			<PropertyImages images={property.images} />
		</>
	);
};
export default PropertyPage;
