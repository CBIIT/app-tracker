import './Layout.css';

import ContentTitle from './ContentTitle/ContentTitle';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

const layout = ({ children }) => (
	<>
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

export default layout;
