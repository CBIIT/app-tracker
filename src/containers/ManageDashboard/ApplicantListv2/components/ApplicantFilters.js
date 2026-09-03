import { Radio } from 'antd';
import {
	APP_TRIAGE,
	SCORING,
	IN_REVIEW,
	REVIEW_COMPLETE,
} from '../../../../constants/ApplicationStates';

const ApplicantFilter = ({ canViewTriage, onStateChange, activeState }) => {
	return (
		<div>
			<p style={{ display: 'inline-block' }}>Filter Applications: </p>
			<Radio.Group
				style={{ display: 'inline-block', paddingLeft: '10px' }}
				onChange={(e) => onStateChange(e.target.value)}
				value={activeState}
			>
				{canViewTriage && (
					<Radio.Button value={APP_TRIAGE}>Triage</Radio.Button>
				)}
				<Radio.Button value={SCORING}>Individual Scoring</Radio.Button>
				<Radio.Button value={IN_REVIEW}>Committee Review</Radio.Button>
				<Radio.Button value={REVIEW_COMPLETE}>Selected</Radio.Button>
			</Radio.Group>
		</div>
	);
};

export default ApplicantFilter;
