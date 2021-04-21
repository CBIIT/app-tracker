import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, message } from 'antd';
import {
	LikeOutlined,
	DislikeOutlined,
	QuestionCircleOutlined,
} from '@ant-design/icons';

import ApplicantInfo from './ApplicantInfo/ApplicantInfo';
import Address from './Address/Address';
import Documents from './Documents/Documents';
import References from './References/References';
import TriageWidget from './TriageWidget/TriageWidget';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend';
import {
	GET_APPLICATION,
	GET_APPLICATION_TRIAGE_INFO,
	SUBMIT_TRIAGE,
} from '../../constants/ApiEndpoints';

import './Application.css';

const steps = [
	{
		key: 'owmTriage',
		title: 'OWM Triage',
	},
	{ key: 'chairTriage', title: 'Chair Triage' },
	{ key: 'individualScoring', title: 'Individual Scoring' },
	{ key: 'committeeScoring', title: 'Committee Scoring' },
];

const triageOptions = [
	{
		label: (
			<>
				<LikeOutlined /> Yes
			</>
		),
		value: 'yes',
	},
	{
		label: (
			<>
				<DislikeOutlined /> No
			</>
		),
		value: 'no',
	},
	{
		label: (
			<>
				<QuestionCircleOutlined /> Maybe
			</>
		),
		value: 'maybe',
	},
];

const application = () => {
	const [application, setApplication] = useState();
	const [vacancyTitle, setVacancyTitle] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [reloadingTriage, setReloadingTriage] = useState(false);
	const [triageChoice, setTriageChoice] = useState();
	const [triageComments, setTriageComments] = useState();

	const onTriageSelect = (event) => {
		setTriageChoice(event.target.value);
	};

	const onTriageCommentsChange = (event) => {
		setTriageComments(event.target.value);
	};

	const onTriageWidgetCancelClick = async () => {
		try {
			setReloadingTriage(true);
			const response = await axios.get(GET_APPLICATION + sysId);
			setTriageChoice(response.data.result.basic_info.triage.value);
			setTriageComments(response.data.result.basic_info.triage_comments.value);
			message.success('Unsaved feedback and notes changes undone.');
		} catch (error) {
			console.log('[Application] error:', error);
		}
		setReloadingTriage(false);
	};

	const onTriageWidgetSaveClick = async () => {
		try {
			const triage = {
				vacancy_id: application.vacancyId,
				app_sys_id: application.appSysId,
				triage: triageChoice,
				triage_comments: triageComments,
			};

			await axios.post(SUBMIT_TRIAGE, triage);
			message.success('Feedback and notes saved.');
		} catch (error) {
			message.error(
				'Sorry!  There was an error in saving.  Try reloading the page and saving again.'
			);
		}
	};

	const { sysId } = useParams();

	useEffect(() => {
		(async () => {
			setIsLoading(true);

			try {
				const responses = await Promise.all([
					axios.get(GET_APPLICATION + sysId),
					axios.get(GET_APPLICATION_TRIAGE_INFO + sysId),
				]);
				const application = transformJsonFromBackend(responses[0].data.result);

				console.log('[Application] application', application);
				console.log('[Application] response[0]', responses[0]);
				console.log('[Application] response[1]', responses[1]);

				setApplication(application);
				setVacancyTitle(responses[0].data.result.basic_info.vacancy.label);
				setTriageChoice(responses[0].data.result.basic_info.triage.value);
				setTriageComments(
					responses[0].data.result.basic_info.triage_comments.value
				);

				setIsLoading(false);
			} catch (error) {
				console.log('[Application] error: ', error);
			}
		})();
	}, []);

	console.log('[Application] application:', application);

	return !isLoading ? (
		<div className='ApplicationContainer'>
			<h1>{vacancyTitle}</h1>
			<div className='ApplicationHeaderBar'>
				<h2>
					Applicant:{' '}
					{application.basicInfo.firstName +
						' ' +
						application.basicInfo.lastName}
				</h2>
				<Button type='link'>view applicants list</Button>
			</div>
			<div className='ApplicationContent'>
				<div className='ApplicationContentColumn' style={{ maxWidth: '675px' }}>
					<ApplicantInfo
						basicInfo={application.basicInfo}
						style={{ backgroundColor: 'white' }}
					/>
					<Address
						address={application.address}
						style={{ backgroundColor: 'white' }}
					/>
					<References
						references={application.references}
						style={{ backgroundColor: 'white' }}
					/>
					<Documents
						documents={application.documents}
						style={{ backgroundColor: 'white' }}
					/>
				</div>
				<div className='ApplicationContentColumn' style={{ maxWidth: '480px' }}>
					{!reloadingTriage ? (
						<TriageWidget
							steps={steps}
							style={{ backgroundColor: 'white' }}
							triageOptions={triageOptions}
							onTriageSelect={onTriageSelect}
							onTriageCommentsChange={onTriageCommentsChange}
							onCancelClick={onTriageWidgetCancelClick}
							onSaveClick={onTriageWidgetSaveClick}
							triageChoice={triageChoice}
							triageComments={triageComments}
							triageCommentsPlaceholder={'Add notes (optional)'}
						/>
					) : null}
					<Button>
						{/* <a href='/exportAttachmentsToZip.do?sysparm_sys_id=828c84d71bdfe850e541631ee54bcbfa'> */}
						<a>Download Application Package</a>
					</Button>
				</div>
			</div>
		</div>
	) : null;
};

export default application;
