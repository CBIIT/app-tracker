import './Layout.css';

import ContentTitle from './ContentTitle/ContentTitle';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import useAuth from '../../hooks/useAuth';
import {
	Alert
} from 'antd';


const layout = ({ children }) => {
	const { auth } = useAuth();

	return (
		<>
			{auth.bannerMessage &&
				<Alert
					type='warning'
					style={{ backgroundColor: 'rgb(178, 73, 6)', color: 'rgb(255, 255, 255)' }}
					message={auth.bannerMessage}
					description={<span dangerouslySetInnerHTML={{ __html: auth.bannerDescription }} />}
					banner
				/>
			}
			<Header />
			<NavBar />
			<div className='OuterContainer'>
				<div className='ContentContainer'>
					<ContentTitle />
					<div className='RouteContent'>{children}</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default layout;
