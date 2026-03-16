import { Steps } from 'antd';

const { Step } = Steps;

const triageWidgetSteps = (props) => (
	<div className='TriageWidgetSteps'>
		<Steps
			current={props.currentStep}
			direction='horizontal'
			progressDot
			size='small'
			responsive='true'
		>
			{props.steps.map((item) => (
				<Step
					key={item.title}
					title={item.title}
					description={item.description}
				/>
			))}
		</Steps>
	</div>
);

export default triageWidgetSteps;
