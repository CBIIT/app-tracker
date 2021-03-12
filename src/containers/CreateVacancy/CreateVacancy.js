import { useState } from 'react';
import { useHistory } from 'react-router';
import { Steps, Button, Form } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import BasicInfo from './Forms/BasicInfo/BasicInfo';
import MandatoryStatements from './Forms/MandatoryStatements/MandatoryStatements';
import './CreateVacancy.css';

const createVacancy = () => {
	const { Step } = Steps;
	const history = useHistory();

	const steps = [
		{
			step: 1,
			title: 'Basic Vacancy Information',
			description: 'Fill in vacancy information',
			content: <BasicInfo />,
		},
		{
			step: 2,
			title: 'Mandatory Statements',
			description:
				'Select pre-written mandatory statements to add to the posting',
			content: <MandatoryStatements />,
		},
		{
			step: 3,
			title: 'Vacancy Committee',
			description: 'Add and manage vacancy committee members',
			content: <></>,
		},
		{
			step: 4,
			title: 'Email Templates',
			description: 'Choose the emails to send applicants and manage email body',
			content: <></>,
		},
		{
			step: 5,
			title: 'Review and Finalize',
			description: '',
			content: <></>,
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
		const { BasicInfo, MandatoryStatements } = forms;
		if (name === 'BasicInfo')
			console.log(
				'[CreateVacancy]: Form name: ' +
					name +
					' values: ' +
					JSON.stringify(BasicInfo.getFieldsValue(), null, 2)
			);

		if (name === 'MandatoryStatements')
			console.log(
				'[CreateVacancy]: Form name: ' +
					name +
					' values: ' +
					JSON.stringify(MandatoryStatements.getFieldsValue(), null, 2)
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
				<div className='StepContentContainer'>
					<div className='StepContent'>
						<h3>{currentStepObject.title}</h3>
						<p>{currentStepObject.description}</p>
						<Form.Provider
							onFormChange={(name, { forms, changedFields }) => {
								wizardFormChangeHandler(name, forms, changedFields);
							}}
						>
							{steps.map((item) => (
								<div
									key={item.step}
									className={`${item.step !== currentStep + 1 && 'Hidden'}`}
								>
									{item.content}
								</div>
							))}
						</Form.Provider>
					</div>
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
