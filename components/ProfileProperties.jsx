'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import deleteProperty from '@/app/actions/deleteProperty';

const ProfileProperties = ({ properties: initialProperties }) => {
	const [properties, setProperties] = useState(initialProperties);

	// If delete button clicked
	const handleDeleteProperty = async (propertyId) => {
		const confirmed = window.confirm(
			'Are you sure you want to delete this property?',
		);

		if (!confirmed) return;

		await deleteProperty(propertyId); //deleteProperty() from actions

		const updatedProperties = properties.filter(
			(property) => property._id !== propertyId, //remove property being deleted from the current array of properties
		);

		setProperties(updatedProperties); // updated State
	};
	return properties.map((property) => (
		<div className='mb-10' key={property._id}>
			<Link href={`/properties/${property._id}`}>
				<Image
					className='h-32 w-full rounded-md object-cover'
					src={property.images[0]}
					alt=''
					width={500}
					height={200}
					priority={true}
				/>
			</Link>
			<div className='mt-2'>
				<p className='text-lg font-semibold'>{property.name}</p>
				<p className='text-gray-600'>
					Address: {property.location.street} {property.location.city}{' '}
					{property.location.state}
				</p>
			</div>
			<div className='mt-2'>
				<Link
					href={`/properties/${property._id}/edit`}
					className='bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600'>
					Edit
				</Link>
				<button
					onClick={() => handleDeleteProperty(property._id)}
					className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600'
					type='button'>
					Delete
				</button>
			</div>
		</div>
	));
};
export default ProfileProperties;
