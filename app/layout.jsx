import '@/assets/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import { GlobalProvider } from '@/context/GlobalContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'photoswipe/dist/photoswipe.css';

export const metadata = {
	title: 'PropertyPulse | Find The Perfect Rental',
	description: 'Find your dream rental property.',
	keywords: 'rental, find rentals, find properties',
};

const MainLayout = ({ children }) => {
	return (
		<AuthProvider>
			<GlobalProvider>
				<html lang='en'>
					<body>
						<Navbar />
						<main>{children}</main>
						<Footer />
						<ToastContainer />
					</body>
				</html>
			</GlobalProvider>
		</AuthProvider>
	);
};
export default MainLayout;
