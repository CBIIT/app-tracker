import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, message, Modal } from 'antd';
import {
	LikeOutlined,
	DislikeOutlined,
	QuestionCircleOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons';

import ApplicantInfo from './ApplicantInfo/ApplicantInfo';
import Address from './Address/Address';
import Documents from './Documents/Documents';
import References from './References/References';
import TriageWidget from './TriageWidget/TriageWidget';
import ScoringWidget from './ScoringWidget/ScoringWidget';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend';
import {
	GET_APPLICATION,
	GET_APPLICATION_TRIAGE_INFO,
	SUBMIT_TRIAGE,
	DISPLAY_REFERENCES,
	CHECK_AUTH,
	GET_VACANCY_MANAGER_VIEW,
} from '../../constants/ApiEndpoints';
import { MANAGE_VACANCY } from '../../constants/Routes';
import {
	COMMITTEE_CHAIR,
	OWM_TEAM,
	COMMITTEE_MEMBER_VOTING,
	COMMITTEE_MEMBER_NON_VOTING,
} from '../../constants/Roles';

import './Application.css';

const { confirm } = Modal;

const individualScoreCategories = [
	{ key: 'knowledge', title: 'Knowledge and Experience' },
	{ key: 'leadership', title: 'Leadership Skills' },
	{ key: 'management', title: 'Management and Supervision' },
	{ key: 'communication', title: 'Communication and Collaboration Skills' },
];

const application = () => {
	const [application, setApplication] = useState();
	const [vacancyTitle, setVacancyTitle] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [triageChoice, setTriageChoice] = useState();
	const [triageComments, setTriageComments] = useState();
	const [chairTriageChoice, setChairTriageChoice] = useState();
	const [chairTriageComments, setChairTriageComments] = useState();
	const [displayReferences, setDisplayReferences] = useState();
	const [userRoles, setUserRoles] = useState([]);
	const [userVacancyCommitteeRole, setUserVacancyCommitteeRole] = useState();
	const [individualTriageChoice, setIndividualTriageChoice] = useState();
	const [individualScores, setIndividualScores] = useState({});
	const [individualScoresComments, setIndividualScoresComments] = useState();

	const history = useHistory();
	const { sysId } = useParams();

	useEffect(() => {
		(async () => {
			setIsLoading(true);

			try {
				const responses = await Promise.all([
					axios.get(GET_APPLICATION + sysId),
					axios.get(GET_APPLICATION_TRIAGE_INFO + sysId),
					axios.get(CHECK_AUTH),
				]);
				const application = transformJsonFromBackend(responses[0].data.result);

				const vacancySysId = responses[0].data.result.basic_info.vacancy.value;
				const vacancy = await axios.get(
					GET_VACANCY_MANAGER_VIEW + vacancySysId
				);

				const roles = vacancy.data.result.user.roles;
				setUserRoles(roles);

				const vacancyCommitteeRole =
					vacancy.data.result.user.committee_role_of_current_vacancy;
				console.log(
					'[Application]: vacancyCommitteeRole',
					vacancyCommitteeRole
				);
				setUserVacancyCommitteeRole(vacancyCommitteeRole);

				console.log('[Application] vacancy:', vacancy);

				console.log('[Application] application', application);
				console.log('[Application] response[0]', responses[0]);
				console.log('[Application] response[1]', responses[1]);
				console.log('[Application] responses[2]', responses[2]);

				// setUserRoles(OWM_TEAM);

				console.log('[Application] roles:', roles);

				setApplication(application);
				setVacancyTitle(responses[0].data.result.basic_info.vacancy.label);
				setTriageChoice(responses[0].data.result.basic_info.triage.value);
				setTriageComments(
					responses[0].data.result.basic_info.triage_comments.value
				);
				setDisplayReferences(
					+responses[0].data.result.basic_info.display_references.value
				);
				setChairTriageChoice('Yes');
				setChairTriageComments('Placeholder chair triage comments');

				setIsLoading(false);
			} catch (error) {
				console.log('[Application] error: ', error);
			}
		})();
	}, []);

	let triageOptions = [
		{
			label: (
				<>
					<LikeOutlined /> yes
				</>
			),
			value: 'yes',
		},
		{
			label: (
				<>
					<DislikeOutlined /> no
				</>
			),
			value: 'no',
		},
	];

	const committeeMemberTriageOptions = [
		{
			label: (
				<>
					<LikeOutlined /> yes
				</>
			),
			value: 'yes',
		},
		{
			label: (
				<>
					<DislikeOutlined /> no
				</>
			),
			value: 'no',
		},
		{
			label: (
				<>
					<QuestionCircleOutlined /> maybe
				</>
			),
			value: 'maybe',
		},
	];

	if (userRoles.includes(OWM_TEAM))
		triageOptions.push({
			label: (
				<>
					<QuestionCircleOutlined /> maybe
				</>
			),
			value: 'maybe',
		});

	const onTriageSelect = (event) => {
		setTriageChoice(event.target.value);
	};

	const onIndividualTriageSelect = (event) => {
		setIndividualTriageChoice(event.target.value);
	};

	const onTriageCommentsChange = (event) => {
		setTriageComments(event.target.value);
	};

	const onTriageWidgetCancelClick = () => {
		confirm({
			title:
				'Are you sure you want to cancel any unsaved changes and return back to the applicants list?',
			icon: <ExclamationCircleOutlined />,
			cancelText: 'cancel',
			okText: 'ok',
			onOk() {
				history.push(MANAGE_VACANCY + application.vacancyId + '/applicants');
			},
		});
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

	const onScoreCommentsChange = (event) => {
		setIndividualScoresComments(event.target.value);
	};

	const handleDisplayReferenceToggle = async (isToggleOn) => {
		try {
			await axios.post(
				DISPLAY_REFERENCES + '/' + application.appSysId + '/' + isToggleOn
			);
			message.success('References preference saved.');
		} catch (error) {
			message.error(
				'Sorry!  An error occurred.  Unable to save.  Try reloading the page and trying again.'
			);
		}
	};

	const individualScoreSlideChangeHandler = (value, category) => {
		const newIndividualScores = { ...individualScores, [category]: value };
		console.log('[Application] newIndividualScores:', newIndividualScores);
		setIndividualScores(newIndividualScores);
	};

	const onIndividualScoreSaveClick = () => {
		try {
			// TODO: Utilize post api to save scores and notes
			const scoresAndNotes = {
				vacancy_id: application.vacancyId,
				app_sys_id: application.appSysId,
				triage: triageChoice,
				triage_comments: triageComments,
				knowledge: individualScores.knowledge,
				leadership: individualScores.leadership,
				management: individualScores.management,
				communication: individualScores.communication,
			};
			console.log('[Application] scoresAndNotes', scoresAndNotes);
			// await axios.post(SUBMIT_TRIAGE, scoresAndNotes);
			message.success('Feedback and notes saved.');
		} catch (error) {
			message.error(
				'Sorry!  An error occurred.  Save unsuccessful.  Try reloading the page and trying again.'
			);
		}
	};

	const isUserAllowedToScore = () => {
		return (
			userVacancyCommitteeRole === COMMITTEE_MEMBER_VOTING ||
			userVacancyCommitteeRole === COMMITTEE_MEMBER_NON_VOTING
		);
	};

	console.log('[Application] application:', application);
	console.log(
		'[Application] current user is manager?: ',
		userRoles.includes(OWM_TEAM)
	);

	return !isLoading ? (
		<>
			<div className='ApplicationContainer'>
				<h1>{vacancyTitle}</h1>
				<div className='ApplicationHeaderBar'>
					<h2>
						Applicant:{' '}
						{application.basicInfo.firstName +
							' ' +
							application.basicInfo.lastName}
					</h2>
					<Link to={MANAGE_VACANCY + application.vacancyId + '/applicants'}>
						<Button type='link'>view applicants list</Button>
					</Link>
				</div>
				<div className='ApplicationContent'>
					<div
						className='ApplicationContentColumn'
						style={{ maxWidth: '675px' }}
					>
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
							switchInitialValue={displayReferences}
							handleToggle={
								userRoles.includes(OWM_TEAM)
									? handleDisplayReferenceToggle
									: null
							}
						/>
						<Documents
							documents={application.documents}
							style={{ backgroundColor: 'white' }}
						/>
					</div>
					<div
						className='ApplicationContentColumn'
						style={{ maxWidth: '480px' }}
					>
						{userRoles.includes(OWM_TEAM) ||
						userVacancyCommitteeRole === COMMITTEE_CHAIR ? (
							<TriageWidget
								title='OWM Team Feedback and Notes'
								style={{ backgroundColor: 'white' }}
								triageOptions={triageOptions}
								onTriageSelect={onTriageSelect}
								onTriageCommentsChange={onTriageCommentsChange}
								onCancelClick={onTriageWidgetCancelClick}
								onSaveClick={onTriageWidgetSaveClick}
								triageChoice={triageChoice}
								triageComments={triageComments}
								triageCommentsPlaceholder={'Add notes (optional)'}
								readOnly={!userRoles.includes(OWM_TEAM)}
							/>
						) : null}

						{userVacancyCommitteeRole === COMMITTEE_CHAIR ? (
							<TriageWidget
								title='Committee Chair Feedback and Notes'
								style={{ backgroundColor: 'white' }}
								triageOptions={triageOptions}
								onTriageSelect={onTriageSelect}
								onTriageCommentsChange={onTriageCommentsChange}
								onCancelClick={onTriageWidgetCancelClick}
								onSaveClick={onTriageWidgetSaveClick}
								triageChoice={chairTriageChoice}
								triageComments={chairTriageComments}
								triageCommentsPlaceholder={'Add notes (optional)'}
							/>
						) : null}
						{isUserAllowedToScore() ? (
							<ScoringWidget
								title='Committee Member Feedback and Notes'
								description='Please score the applicant on a scale of 0 - 3 below and leave detailed
							notes in the comments box below.'
								style={{ backgroundColor: 'white' }}
								scoreChangeHandler={individualScoreSlideChangeHandler}
								onScoreCommentsChange={onScoreCommentsChange}
								triageOptions={committeeMemberTriageOptions}
								triageChoice={individualTriageChoice}
								triageComments={individualScoresComments}
								onTriageSelect={onIndividualTriageSelect}
								categories={individualScoreCategories}
								onCancelClick={onTriageWidgetCancelClick}
								onSaveClick={onIndividualScoreSaveClick}
							/>
						) : null}

						<Button>
							{/* <a href='/exportAttachmentsToZip.do?sysparm_sys_id=828c84d71bdfe850e541631ee54bcbfa'> */}
							<a>Download Application Package</a>
						</Button>
					</div>
				</div>
			</div>
		</>
	) : null;
};

export default application;
