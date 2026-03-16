import { Steps } from 'antd';
import './VacancyStatus.css';

const VacancyStatus = (props) => {
	const customDot = (dot) => <>{dot}</>;
	const state = props.state;

	let currentStatus = '';
	switch (state) {
		case 'Triage':
			currentStatus = 0;
			break;
		case 'Chair Triage':
			currentStatus = 0;
			break;
		case 'Individual Scoring in Progress':
			currentStatus = 1;
			break;
		case 'Individual Scoring Complete':
			currentStatus = 1;
			break;
		case 'Committee Review in Progress':
			currentStatus = 2;
			break;
		case 'Committee Review Complete':
			currentStatus = 2;
			break;
		case 'Voting Complete':
			currentStatus = 3;
			break;
	}

	return (
		<>
			<div className='VacancyStepStatus'>
				<Steps
					current={currentStatus}
					className='vacancy-status'
					progressDot={customDot}
					responsive='true'
				>
					<Steps.Step title='Triage' />
					<Steps.Step title='Individual Scoring' />
					<Steps.Step title='Committee Review' />
					<Steps.Step title='Voting Complete' />
				</Steps>
			</div>
		</>
	);
};

export default VacancyStatus;
