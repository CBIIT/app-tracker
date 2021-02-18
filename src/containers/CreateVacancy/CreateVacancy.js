import React, { useState } from 'react';
import { Steps, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';


import BasicInfo from './Forms/BasicInfo/BasicInfo';
import './CreateVacancy.css';

const { Step } = Steps;

const steps = [
    {
        title: 'Basic Vacancy Information',
        description: 'Fill in vacancy information',
        content: <BasicInfo />
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

const createVacancy = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const currentStepObject = steps[currentStep];

    const next = () => {
        if (currentStep < steps.length)
            setCurrentStep(currentStep + 1);
    };

    const prev = () => {
        if (currentStep > 0)
            setCurrentStep(currentStep - 1);
    };

    const stepClickHandler = current => {
        setCurrentStep(current);
    };

    return (
        <>
            <div className='CreateVacancyContainer'>
                <div className='StepNavigation'>
                    <Steps current={currentStep} direction='vertical' onChange={stepClickHandler}>
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
                    {currentStepObject.content}
                    <div className='steps-action'>
                        <Button
                            onClick={prev} type='primary'
                            ghost
                            className='wider-button'
                        >
                            {(currentStep === 0) ? 'cancel' : 'back'}
                        </Button>
                        <Button type='text' disabled icon={<ReloadOutlined />}>
                            Clear Form
                        </Button>
                        <Button
                            type='primary'
                            onClick={next}
                            className='wider-button'
                        >
                            {(currentStep == steps.length - 1) ? 'Save and Finalize' : 'save'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default createVacancy;