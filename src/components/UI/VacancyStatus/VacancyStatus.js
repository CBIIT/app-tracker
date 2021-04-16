import { Steps } from 'antd';
import './VacancyStatus.css';

const VacancyStatus = (props) => {
	const customDot = (dot) => <>{dot}</>;
	const status = props.status;

	let currentStatus = '';
	switch (status) {
		case 'Open':
			currentStatus = 0;
			break;
		case 'Triage':
			currentStatus = 1;
			break;
		case 'Individual Scoring':
			currentStatus = 2;
			break;
		case 'Committee Scoring':
			currentStatus = 3;
			break;
		case 'Scored':
			currentStatus = 4;
			break;
	}

	return (
		<>
			<Steps
				current={currentStatus}
				className='vacancy-status'
				progressDot={customDot}
			>
				<Steps.Step title='Open' />
				<Steps.Step title='Triage' />
				<Steps.Step title='Individual Scoring' />
				<Steps.Step title='Committee Scoring' />
				<Steps.Step title='Scored' />
			</Steps>
		</>
	);
};

export default VacancyStatus;
