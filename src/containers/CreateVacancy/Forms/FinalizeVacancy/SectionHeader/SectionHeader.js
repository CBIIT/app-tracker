import { Button } from 'antd';

import './SectionHeader.css';

const sectionHeader = (props) => {
	return (
		<div className='SectionHeader'>
			<h2>{props.title}</h2>
			<Button type='link' onClick={props.onClick}>
				edit section
			</Button>
		</div>
	);
};

export default sectionHeader;
