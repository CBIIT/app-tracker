import { useState } from 'react';
import { Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import './InfoCard.css';
const infoCard = (props) => {
	const [hideContent, setHideContent] = useState(props.initiallyHideContent);

	const onHeadingClickHandler = () => {
		const newHideContent = !hideContent;
		setHideContent(newHideContent);
	};

	return (
		<div
			className={`InfoCardContainer ${props.className || ''}`}
			style={props.style}
		>
			<div
				className='InfoCardHeading'
				onClick={props.allowToggle ? onHeadingClickHandler : null}
				style={props.allowToggle ? { cursor: 'pointer' } : null}
			>
				<h3>{props.title}</h3>
				{props.onSwitchToggle ? (
					<div>
						<Switch
							className='InfoCardSwitch'
							checkedChildren={<CheckOutlined />}
							unCheckedChildren={<CloseOutlined />}
							title={props.switchTitle}
							onChange={props.onSwitchToggle}
							defaultChecked={props.switchInitialValue}
						/>
						<span className='InfoCardSwitchLabel'>{props.switchTitle}</span>
					</div>
				) : null}
			</div>

			<hr />
			<div
				className='InfoCardContent'
				style={hideContent ? { display: 'none' } : null}
			>
				{props.children}
			</div>
		</div>
	);
};

export default infoCard;
