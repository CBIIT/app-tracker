import './InfoCard.css';
import { Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const infoCard = (props) => {
	return (
		<div
			className={`InfoCardContainer ${props.className || ''}`}
			style={props.style}
		>
			<div className='InfoCardHeading'>
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
			<div className='InfoCardContent'>{props.children}</div>
		</div>
	);
};

export default infoCard;
