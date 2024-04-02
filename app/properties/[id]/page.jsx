'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchProperty } from '@/utils/requests';
import PropertyHeaderImage from '@/components/PropertyHeaderImage';

const PropertyPage = () => {
	const { id } = useParams();
	const [property, setProperty] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// create async function inside useEffect, cannot put async to useEffect itself  ie. useEffect(async() =>
		const fetchPropertyData = async () => {
			if (!id) return;
			try {
				const property = await fetchProperty(id);
				setProperty(property);
			} catch (error) {
				console.error('Error fetching property:', error);
			} finally {
				setLoading(false);
			}
		};
		if (property === null) {
			// only call fetchPropertyData if property is null. It will create an infinite loop if property is always changing
			fetchPropertyData();
		}
	}, [id, property]);

	if (!property && !loading) {
		return (
			<h1 className='text-center text-2xl font-bold mt-10'>
				Property Not Found
			</h1>
		);
	}

	return (
		<>
			{!loading && property && (
				<>
					<PropertyHeaderImage image={property.images[0]} />
				</>
			)}
		</>
	);
};
export default PropertyPage;
