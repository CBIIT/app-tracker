import { Steps } from 'antd';
import './VacancyStatus.css';

const VacancyStatus = (props) => {
	const customDot = (dot) => <>{dot}</>;
	const state = props.state;

	let currentStatus = '';
	switch (state) {
		case 'Live':
			currentStatus = 0;
			break;
		case 'OWM Team Triage':
			currentStatus = 1;
			break;
		case 'Chair Triage':
			currentStatus = 1;
			break;
		case 'Individual Scoring in Progress':
			currentStatus = 2;
			break;
		case 'Individual Scoring Complete':
			currentStatus = 2;
			break;
		case 'Committee Review in Progress':
			currentStatus = 3;
			break;
		case 'Committee Review Complete':
			currentStatus = 3;
			break;
		// case 'Scored':
		// 	currentStatus = 4;
		// 	break;
	}

	return (
		<>
			<Steps
				current={currentStatus}
				className='vacancy-status'
				progressDot={customDot}
			>
				<Steps.Step title='Live' />
				<Steps.Step title='Triage' />
				<Steps.Step title='Individual Scoring' />
				<Steps.Step title='Committee Review' />
				{/* <Steps.Step title='Scored' /> */}
			</Steps>
		</>
	);
};

export default VacancyStatus;
