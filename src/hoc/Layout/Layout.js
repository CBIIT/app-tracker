import './Layout.css';

import ContentTitle from './ContentTitle/ContentTitle';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import {
	Alert
} from 'antd';

const banner = `Because of a lapse in government funding, the information on this website may not be up to date, 
transactions submitted via the website may not be processed, and the agency may not be able to respond to inquiries 
until appropriations are enacted. The NIH Clinical Center (the research hospital of NIH) is open. For more details 
about its operating status, please visit <a href="https://cc.nih.gov" target="_blank" rel="noopener noreferrer" 
style="color: #FFFFFF;">cc.nih.gov</a>. Updates regarding government operating status and resumption of normal 
operations can be found at <a href="https://opm.gov" target="_blank" rel="noopener noreferrer" 
style="color: #FFFFFF;">opm.gov</a>.`;


const layout = ({ children }) => (
	<>
		<Alert
			type='warning'
			style={{ backgroundColor: 'rgb(178, 73, 6)', color: 'rgb(255, 255, 255)' }}
			message='Government Funding Lapse'
			description={<span dangerouslySetInnerHTML={{ __html: banner }} />}
			banner
		/>
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
