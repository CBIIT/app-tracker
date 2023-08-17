import { Button } from 'antd';

import './ReviewSectionHeader.css';

const sectionHeader = (props) => {
	if (props.showButton == 'false') {
		return (
			<div className='SectionHeader'>
				<h2 style={!props.error ? null : {color: 'red'}}>{props.title}</h2>
			</div>
		);
	} else {
		return (
			<div className='SectionHeader'>
				<h2 style={!props.error ? null : {color: 'red'}}>{props.error ? '! ' : null}{props.title}</h2>
				<Button type='link' onClick={props.onClick}>
					Edit Section
				</Button>
			</div>
		);
	}
};

export default sectionHeader;
