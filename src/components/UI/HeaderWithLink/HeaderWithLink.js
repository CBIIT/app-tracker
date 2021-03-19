import { Link } from 'react-router-dom';
import { Button } from 'antd';

import './HeaderWithLink.css';

const headerWithLink = (props) => (
	<div className='HeaderWithLink'>
		<h1>{props.title}</h1>
		<Link target='_blank' to={props.route}>
			<Button type='link'>
				<u>{props.routeTitle}</u>
			</Button>
		</Link>
	</div>
);

export default headerWithLink;
