import { Button } from 'antd';
import { Link } from 'react-router-dom';
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
				<Link to={'/apply/' + props.sysId}>
					<Button type='primary'>Sign In and Apply</Button>
				</Link>
			</div>
		</div>
	);
};

export default header;
