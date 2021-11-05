import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, message, Modal, Tooltip } from 'antd';
import {
	LikeOutlined,
	DislikeOutlined,
	QuestionCircleOutlined,
	ExclamationCircleOutlined,
	DownloadOutlined,
} from '@ant-design/icons';

import InfoCard from '../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../components/UI/InfoCard/InfoCardRow/InfoCardRow';
import ApplicantInfo from './ApplicantInfo/ApplicantInfo';
import Address from './Address/Address';
import Documents from './Documents/Documents';
import References from './References/References';
import TriageWidget from './TriageWidget/TriageWidget';
import ScoringWidget from './ScoringWidget/ScoringWidget';
import AdminScoringWidget from './AdminScoringWidget/AdminScoringWidget';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend';
import {
	GET_APPLICATION,
	SUBMIT_TRIAGE,
	DISPLAY_REFERENCES,
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

import {
	INDIVIDUAL_SCORING_IN_PROGRESS,
	INDIVIDUAL_SCORING_COMPLETE,
	COMMITTEE_REVIEW_IN_PROGRESS,
	COMMITTEE_REVIEW_COMPLETE,
	VOTING_COMPLETE,
	OWM_TRIAGE,
	CHAIR_TRIAGE,
} from '../../constants/VacancyStates.js';

import './Application.css';
import LabelValuePair from '../../components/UI/LabelValuePair/LabelValuePair';

const { confirm } = Modal;

const individualScoreCategories = [
	{ key: 'category1', title: 'Category 1' },
	{ key: 'category2', title: 'Category 2' },
	{ key: 'category3', title: 'Category 3' },
	{ key: 'category4', title: 'Category 4' },
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

const displayCommitteeReview = (vacancyState) => {
	switch (vacancyState) {
		case COMMITTEE_REVIEW_IN_PROGRESS:
		case COMMITTEE_REVIEW_COMPLETE:
		case VOTING_COMPLETE:
			return true;
		default:
			return false;
	}
};

const application = () => {
	const [application, setApplication] = useState();
	const [vacancyTitle, setVacancyTitle] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [triageChoice, setTriageChoice] = useState();
	const [triageComments, setTriageComments] = useState();
	const [chairTriageChoice, setChairTriageChoice] = useState();
	const [chairTriageComments, setChairTriageComments] = useState();
	const [committeeDecision, setCommitteeDecision] = useState();
	const [committeeComments, setCommitteeComments] = useState();
	const [displayReferences, setDisplayReferences] = useState();
	const [appDocIds, setAppDocIds] = useState([]);
	const [userRoles, setUserRoles] = useState([]);
	const [userVacancyCommitteeRole, setUserVacancyCommitteeRole] = useState();
	const [individualTriageChoice, setIndividualTriageChoice] = useState();
	const [individualScores, setIndividualScores] = useState({});
	const [individualScoresComments, setIndividualScoresComments] = useState();
	const [ratingPlanDownloadLink, setRatingPlanDownloadLink] = useState();
	const [references, setReferences] = useState([]);
	const [vacancyState, setVacancyState] = useState();

	const history = useHistory();
	const { sysId } = useParams();

	useEffect(() => {
		loadApplication();
	}, []);

	const reloadReferences = async () => {
		const applicationResponse = await axios.get(GET_APPLICATION + sysId);
		const application = transformJsonFromBackend(
			applicationResponse.data.result
		);

		setReferences(application.references);
	};

	const loadApplication = async () => {
		setIsLoading(true);

		try {
			const applicationResponse = await axios.get(GET_APPLICATION + sysId);
			const application = transformJsonFromBackend(
				applicationResponse.data.result
			);
			setCommitteeComments(
				applicationResponse.data.result.basic_info.committee_comments.label
			);
			setCommitteeDecision(
				applicationResponse.data.result.basic_info.committee_decision.label
			);

			setReferences(application.references);

			const vacancySysId =
				applicationResponse.data.result.basic_info.vacancy.value;
			const vacancy = await axios.get(GET_VACANCY_MANAGER_VIEW + vacancySysId);

			const roles = vacancy.data.result.user.roles;
			setUserRoles(roles);

			const vacancyCommitteeRole =
				vacancy.data.result.user.committee_role_of_current_vacancy;

			if (vacancy.data.result.rating_plan)
				setRatingPlanDownloadLink(
					vacancy.data.result.rating_plan.attachment_dl
				);

			setUserVacancyCommitteeRole(vacancyCommitteeRole);

			const appDocs = applicationResponse.data.result.app_documents;
			const filteredAppDocs = appDocs
				.filter((doc) => doc.attach_sys_id.length > 0)
				.map((filtDoc) => filtDoc.doc_sys_id);
			setAppDocIds(filteredAppDocs);

			setApplication(application);
			setVacancyTitle(applicationResponse.data.result.basic_info.vacancy.label);
			setVacancyState(vacancy.data.result.basic_info.state.value);
			setTriageChoice(applicationResponse.data.result.basic_info.triage.value);
			setTriageComments(
				applicationResponse.data.result.basic_info.triage_comments.value
			);
			setDisplayReferences(
				+applicationResponse.data.result.basic_info.display_references.value
			);
			setChairTriageChoice(
				applicationResponse.data.result.basic_info.chair_triage.value
			);
			setChairTriageComments(
				applicationResponse.data.result.basic_info.chair_triage_comment.value
			);

			if (applicationResponse.data.result.individual_scoring) {
				const individualScores =
					applicationResponse.data.result.individual_scoring;

				setIndividualScores({
					category1: individualScores.category_1.value,
					category2: individualScores.category_2.value,
					category3: individualScores.category_3.value,
					category4: individualScores.category_4.value,
				});

				setIndividualScoresComments(individualScores.comments.value);
				setIndividualTriageChoice(individualScores.recommend.value);
			}

			setIsLoading(false);
		} catch (error) {
			console.log('[Application] error: ', error);
		}
	};

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

	const onTriageWidgetSaveClick = async (widget) => {
		let triage = {};
		try {
			if (widget === 'chairWidget') {
				if (chairTriageChoice === 'no' && !chairTriageComments) {
					message.error('Please provide a note for why "no" was selected.');
				} else {
					triage = {
						app_sys_id: application.appSysId,
						chair_triage: chairTriageChoice,
						chair_triage_comments: chairTriageComments,
					};

					await axios.post(SUBMIT_TRIAGE, triage);
					history.push(MANAGE_VACANCY + application.vacancyId + '/applicants');
					message.success('Feedback and notes saved.');
				}
			} else {
				triage = {
					app_sys_id: application.appSysId,
					OWM_triage: triageChoice,
					OWM_triage_comments: triageComments,
				};

				await axios.post(SUBMIT_TRIAGE, triage);
				message.success('Feedback and notes saved.');
			}
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
				category_1: individualScores.category1 ? individualScores.category1 : 0,
				category_2: individualScores.category2 ? individualScores.category2 : 0,
				category_3: individualScores.category3 ? individualScores.category3 : 0,
				category_4: individualScores.category4 ? individualScores.category4 : 0,
			};
			await axios.post(SUBMIT_INDIVIDUAL_SCORING, scoresAndNotes);
			history.push(MANAGE_VACANCY + application.vacancyId + '/applicants');
			message.success('Feedback and notes saved.');
		} catch (error) {
			message.error(
				'Sorry!  An error occurred.  Save unsuccessful.  Try reloading the page and trying again.'
			);
		}
	};

	const isChair = () => {
		return userVacancyCommitteeRole === COMMITTEE_CHAIR;
	};

	const isChairAllowedScore = () => {
		return (
			vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS ||
			vacancyState === INDIVIDUAL_SCORING_COMPLETE ||
			vacancyState === COMMITTEE_REVIEW_IN_PROGRESS ||
			vacancyState === COMMITTEE_REVIEW_COMPLETE
		);
	};

	const isUserAllowedToScore = () => {
		return (
			userVacancyCommitteeRole === COMMITTEE_MEMBER_VOTING ||
			userVacancyCommitteeRole === COMMITTEE_MEMBER_NON_VOTING ||
			userVacancyCommitteeRole === COMMITTEE_CHAIR
		);
	};

	const onViewApplicantsListClick = () => {
		history.push(MANAGE_VACANCY + application.vacancyId + '/applicants');
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
					<Button
						onClick={onViewApplicantsListClick}
						ghost
						type='primary'
						style={{ marginBottom: '8px' }}
					>
						view applicants list
					</Button>
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
								references={references}
								style={{ backgroundColor: 'white' }}
								switchInitialValue={displayReferences}
								handleToggle={
									userRoles.includes(OWM_TEAM)
										? handleDisplayReferenceToggle
										: null
								}
								allowUploadOrDelete={userRoles.includes(OWM_TEAM)}
								afterUploadOrDelete={reloadReferences}
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
						{userRoles.includes(OWM_TEAM) || isChair() ? (
							<>
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
									initiallyHideContent={
										vacancyState === OWM_TRIAGE ? false : true
									}
									maxCommentLength={10000}
								/>
								<TriageWidget
									title='Committee Chair Feedback and Notes'
									style={{ backgroundColor: 'white' }}
									triageOptions={chairTriageOptions}
									onTriageSelect={onChairTriageSelect}
									onTriageCommentsChange={onChairCommentsChange}
									onCancelClick={onTriageWidgetCancelClick}
									onSaveClick={() => onTriageWidgetSaveClick('chairWidget')}
									triageChoice={chairTriageChoice}
									triageComments={chairTriageComments}
									triageCommentsPlaceholder={
										'Add notes ' +
										(chairTriageChoice === 'no' ? '' : '(optional)')
									}
									initiallyHideContent={
										vacancyState === CHAIR_TRIAGE ? false : true
									}
									maxCommentLength={10000}
								/>
							</>
						) : null}

						{(isUserAllowedToScore() && !isChair()) ||
						(isChair() && isChairAllowedScore()) ? (
							<ScoringWidget
								title={
									isChair()
										? 'Committee Chair Rating and Feedback'
										: 'Committee Member Rating and Feedback'
								}
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

						{userRoles.includes(OWM_TEAM) ? (
							<AdminScoringWidget
								applicationId={sysId}
								ratingPlanDownloadLink={ratingPlanDownloadLink}
								style={{ backgroundColor: 'white' }}
								triageOptions={committeeMemberTriageOptions}
								categories={individualScoreCategories}
								onCancelClick={onTriageWidgetCancelClick}
								initiallyHideContent={
									vacancyState !== INDIVIDUAL_SCORING_IN_PROGRESS
								}
							/>
						) : null}

						{(isChair() || userRoles.includes(OWM_TEAM)) &&
						displayCommitteeReview(vacancyState) ? (
							<InfoCard
								title='Committee Review'
								style={{ backgroundColor: 'white' }}
								allowToggle={true}
								initiallyHideContent={false}
							>
								<InfoCardRow>
									<LabelValuePair
										label='Committee Vote'
										value={committeeDecision}
									/>
								</InfoCardRow>
								<InfoCardRow>
									<LabelValuePair
										label='Committee Comments'
										value={committeeComments}
									/>
								</InfoCardRow>
							</InfoCard>
						) : null}
						<Tooltip
							placement='top'
							title={
								appDocIds.length === 0
									? 'There are no application documents.'
									: ''
							}
						>
							<Button disabled={appDocIds.length === 0}>
								<a
									href={
										'/exportAttachmentsToZip.do?sysparm_sys_id=' +
										appDocIds +
										'&sysparm_ck=' +
										window.servicenowUserToken
									}
								>
									Download Application Documents {<DownloadOutlined />}
								</a>
							</Button>
						</Tooltip>
						<Button style={{ marginTop: '10px' }}>
							<a
								href={
									'/x_g_nci_app_tracke_application.do?PDF&sys_id=' +
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
