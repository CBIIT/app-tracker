import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, message, Modal } from 'antd';
import {
	LikeOutlined,
	DislikeOutlined,
	QuestionCircleOutlined,
	ExclamationCircleOutlined,
	DownloadOutlined,
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
	SUBMIT_INDIVIDUAL_SCORING,
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

const chairTriageOptions = [
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

const owmTriageOptions = [
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

const application = () => {
	const [application, setApplication] = useState();
	const [vacancyTitle, setVacancyTitle] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [triageChoice, setTriageChoice] = useState();
	const [triageComments, setTriageComments] = useState();
	const [chairTriageChoice, setChairTriageChoice] = useState();
	const [chairTriageComments, setChairTriageComments] = useState();
	const [displayReferences, setDisplayReferences] = useState();
	const [appDocIds, setAppDocIds] = useState();
	const [userRoles, setUserRoles] = useState([]);
	const [userVacancyCommitteeRole, setUserVacancyCommitteeRole] = useState();
	const [individualTriageChoice, setIndividualTriageChoice] = useState();
	const [individualScores, setIndividualScores] = useState({});
	const [individualScoresComments, setIndividualScoresComments] = useState();
	const [ratingPlanDownloadLink, setRatingPlanDownloadLink] = useState();

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

				if (vacancy.data.result.rating_plan)
					setRatingPlanDownloadLink(
						vacancy.data.result.rating_plan.attachment_dl
					);

				setUserVacancyCommitteeRole(vacancyCommitteeRole);

				const appDocs = responses[0].data.result.app_documents;
				const filteredAppDocs = appDocs
					.filter((doc) => doc.attach_sys_id.length > 0)
					.map((filtDoc) => filtDoc.doc_sys_id);
				setAppDocIds(filteredAppDocs);

				setApplication(application);
				setVacancyTitle(responses[0].data.result.basic_info.vacancy.label);
				setTriageChoice(responses[0].data.result.basic_info.triage.value);
				setTriageComments(
					responses[0].data.result.basic_info.triage_comments.value
				);
				setDisplayReferences(
					+responses[0].data.result.basic_info.display_references.value
				);
				setChairTriageChoice(
					responses[0].data.result.basic_info.chair_triage.value
				);
				setChairTriageComments(
					responses[0].data.result.basic_info.chair_triage_comment.value
				);

				if (responses[0].data.result.individual_scoring) {
					const individualScores = responses[0].data.result.individual_scoring;

					setIndividualScores({
						knowledge: individualScores.knowledge_experience.value,
						leadership:
							individualScores.development_implementation_coordination.value,
						management:
							individualScores.management_leadership_supervision.value,
						communication: individualScores.communication_skill.value,
					});

					setIndividualScoresComments(individualScores.comments.value);
					setIndividualTriageChoice(individualScores.recommend.value);
				}

				setIsLoading(false);
			} catch (error) {
				console.log('[Application] error: ', error);
			}
		})();
	}, []);

	const onTriageSelect = (event) => {
		setTriageChoice(event.target.value);
	};

	const onTriageCommentsChange = (event) => {
		setTriageComments(event.target.value);
	};

	const onIndividualTriageSelect = (event) => {
		setIndividualTriageChoice(event.target.value);
	};

	const onChairTriageSelect = (event) => {
		setChairTriageChoice(event.target.value);
	};

	const onChairCommentsChange = (event) => {
		setChairTriageComments(event.target.value);
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
				app_sys_id: application.appSysId,
				triage:
					userVacancyCommitteeRole === COMMITTEE_CHAIR
						? chairTriageChoice
						: triageChoice,
				triage_comments:
					userVacancyCommitteeRole === COMMITTEE_CHAIR
						? chairTriageComments
						: triageComments,
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
		setIndividualScores(newIndividualScores);
	};

	const onIndividualScoreSaveClick = async () => {
		try {
			const scoresAndNotes = {
				app_sys_id: application.appSysId,
				recommend: individualTriageChoice,
				comments: individualScoresComments,
				knowledge_experience: individualScores.knowledge
					? individualScores.knowledge
					: 0,
				development_implementation_coordination: individualScores.leadership
					? individualScores.leadership
					: 0,
				management_leadership_supervision: individualScores.management
					? individualScores.management
					: 0,
				communication_skill: individualScores.communication
					? individualScores.communication
					: 0,
			};
			await axios.post(SUBMIT_INDIVIDUAL_SCORING, scoresAndNotes);
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

						{!displayReferences && !userRoles.includes(OWM_TEAM) ? null : (
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
						)}

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
								triageOptions={owmTriageOptions}
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
								triageOptions={chairTriageOptions}
								onTriageSelect={onChairTriageSelect}
								onTriageCommentsChange={onChairCommentsChange}
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
								description={
									<>
										Please score the applicant on a scale of 0 - 3 below and
										leave detailed notes in the comments box below.{' '}
										<a href={ratingPlanDownloadLink}>See Rating Plan.</a>
									</>
								}
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
								scores={individualScores}
							/>
						) : null}

						<Button>
							<a
								href={
									'https://service-dev2.nci.nih.gov/exportAttachmentsToZip.do?sysparm_sys_id=' +
									appDocIds
								}
							>
								Download Application Documents {<DownloadOutlined />}
							</a>
						</Button>
						<Button style={{ marginTop: '10px' }}>
							<a
								href={
									'https://service-dev2.nci.nih.gov/x_g_nci_app_tracke_application.do?PDF&sys_id=' +
									application.appSysId
								}
							>
								Download Applicant Info {<DownloadOutlined />}
							</a>
						</Button>
					</div>
				</div>
			</div>
		</>
	) : null;
};

export default application;
