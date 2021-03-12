import { Button } from 'antd';
import './Header.css';

const header = (props) => {
	return (
		<div className='HeaderContainer'>
			<div className='TitleAndDateContainer'>
				<h1>{props.title}</h1>
				<div className='DateContainer'>
					<div className='DateItem'>
						<label>Open Date</label>
						<span>{props.openDate}</span>
					</div>
					<div className='DateItem'>
						<label>Close Date</label>
						<span>{props.closeDate}</span>
					</div>
				</div>
			</div>
			<div className='ButtonContainer'>
				<Button type='primary'>Sign In and Apply</Button>
			</div>
		</div>
	);
};

export default header;
