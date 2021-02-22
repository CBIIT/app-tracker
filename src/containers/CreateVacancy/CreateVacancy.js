import { useState } from 'react';
import { useHistory } from 'react-router';
import { Steps, Button, Form } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import BasicInfo from './Forms/BasicInfo/BasicInfo';
import './CreateVacancy.css';

const createVacancy = () => {
	const { Step } = Steps;
	const history = useHistory();

	const steps = [
		{
			title: 'Basic Vacancy Information',
			description: 'Fill in vacancy information',
			content: <BasicInfo />,
		},
		{
			title: 'Mandatory Statements',
			description: 'Mailing and business address',
		},
		{
			title: 'Vacancy Committee',
			description: 'Add and manage vacancy committee members',
		},
		{
			title: 'Email Templates',
			description: 'Choose the emails to send applicants and manage email body',
		},
		{
			title: 'Review and Finalize',
			description: '',
		},
	];

	const [currentStep, setCurrentStep] = useState(0);

	const next = () => {
		setCurrentStep(currentStep + 1);
	};

	const prev = () => {
		currentStep === 0 ? history.goBack() : setCurrentStep(currentStep - 1);
	};

	const currentStepObject = steps[currentStep] || {};

	const stepClickHandler = (current) => {
		setCurrentStep(current);
	};

	const wizardFormChangeHandler = (name, forms) => {
		const { BasicInfo } = forms;
		console.log(
			'[CreateVacancy]: Form name: ' +
				name +
				' values: ' +
				JSON.stringify(BasicInfo.getFieldsValue(), null, 2)
		);
	};

	return (
		<>
			<div className='CreateVacancyContainer'>
				<div className='StepNavigation'>
					<Steps
						current={currentStep}
						direction='vertical'
						onChange={stepClickHandler}
					>
						{steps.map((item) => (
							<Step
								key={item.title}
								title={item.title}
								description={item.description}
							/>
						))}
					</Steps>
				</div>
				<div className='StepContent'>
					<h3>{currentStepObject.title}</h3>
					<p>{currentStepObject.description}</p>
					<Form.Provider
						onFormChange={(name, { forms }) => {
							wizardFormChangeHandler(name, forms);
						}}
					>
						{currentStepObject.content}
					</Form.Provider>
					<div className='steps-action'>
						<Button
							onClick={prev}
							type='primary'
							ghost
							className='wider-button'
						>
							{currentStep === 0 ? 'cancel' : 'back'}
						</Button>
						<Button type='text' disabled icon={<ReloadOutlined />}>
							Clear Form
						</Button>
						<Button type='primary' onClick={next} className='wider-button'>
							{currentStep == steps.length - 1 ? 'Save and Finalize' : 'save'}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default createVacancy;
