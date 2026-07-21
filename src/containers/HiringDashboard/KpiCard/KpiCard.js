import { LoadingOutlined } from '@ant-design/icons';
import './KpiCard.css';

const kpiCard = ({ value, label, loading, color }) => {
	return (
		<div className='KpiCard' style={{ borderTopColor: color || '#1890ff' }}>
			<div className='KpiCardValue'>
				{loading ? (
					<LoadingOutlined style={{ fontSize: '28px' }} spin />
				) : (
					value
				)}
			</div>
			<div className='KpiCardLabel'>{label}</div>
		</div>
	);
};

export default kpiCard;
