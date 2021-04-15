import { Button } from 'antd';

import './ReviewSectionHeader.css';

const sectionHeader = (props) => {
	if (props.showButton == 'false') {
		return (
			<div className='SectionHeader'>
				<h2>{props.title}</h2>
			</div>
		);
	} else {
		return (
			<div className='SectionHeader'>
				<h2>{props.title}</h2>
				<Button type='link' onClick={props.onClick}>
					edit section
				</Button>
			</div>
		);
	}
};

export default sectionHeader;
