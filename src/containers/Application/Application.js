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
	ExclamationCircleFilled,
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
	RECUSE,
	GET_DRAFT,
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
import { displayReferenceContactQuestion } from '../../components/Util/Application/Application';
import { isAllowedToVacancyManagerTriage } from './Util/Permissions';
import Loading from '../../components/Loading/Loading';

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
	const [vacancyData, setVacancyData] = useState();
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
	const [individualTriageChoice, setIndividualTriageChoice] = useState();
	const [individualScores, setIndividualScores] = useState({});
	const [individualScoresComments, setIndividualScoresComments] = useState();
	const [ratingPlanDownloadLink, setRatingPlanDownloadLink] = useState();
	const [references, setReferences] = useState([]);
	const [vacancyState, setVacancyState] = useState();
	const [vacancyTenantType, setVacancyTenantType] = useState();
	const [additionalDocumentLinks, setAdditionalDocumentLinks] = useState([]);
	const [showRecuseModal, setShowRecuseModal] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [recused, setRecused] = useState(false);
	const [focusArea, setFocusArea] = useState([]);
	const [requireFocusArea, setRequireFocusArea] = useState('0');

	const history = useHistory();
	const { sysId } = useParams();

	useEffect(() => {
		loadApplication();
	}, []);
	
	const openRecuseModal = (e) => {
		e.preventDefault();
		setShowRecuseModal(true);
	};

	const closeRecuseModal = () => {
		setShowRecuseModal(false);
	};

	const unrecuseSelf = async () => {
		try {
			const recuseData = { applicationId: sysId, recuse: false };
			const response = await axios.put(RECUSE, recuseData);

			setRecused(response.data.result.recused);
			message.success(
				'You have successfully unrecused yourself for the scoring of this applicant.'
			);
		} catch (error) {
			message.error(
				'Sorry, something went wrong!  Try refreshing the page and trying again.'
			);
		}
	};

	const recuseSelf = async () => {
		setConfirmLoading(true);
		try {
			setConfirmLoading(true);
			const recuseData = { applicationId: sysId, recuse: true };
			const response = await axios.put(RECUSE, recuseData);

			closeRecuseModal();
			setRecused(response.data.result.recused);

			message.success(
				'You have successfully recused yourself for the scoring of this applicant.'
			);
		} catch (error) {
			message.error(
				'Sorry, something went wrong!  Try refreshing the page and trying again.'
			);
		}

		setConfirmLoading(false);
	};

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
			setVacancyData(vacancy.data.result);

			const roles = vacancy.data.result.user.roles;
			setUserRoles(roles);

			if (vacancy.data.result.rating_plan)
				setRatingPlanDownloadLink(
					vacancy.data.result.rating_plan.attachment_dl
				);

			const appDocs = applicationResponse.data.result.app_documents;
			const filteredAppDocs = appDocs
				.filter((doc) => doc.attach_sys_id.length > 0)
				.map((filtDoc) => filtDoc.doc_sys_id);
			setAppDocIds(filteredAppDocs);

			setApplication(application);
			setVacancyTitle(applicationResponse.data.result.basic_info.vacancy.label);
			setVacancyState(vacancy.data.result.basic_info.state.value);
			setVacancyTenantType(vacancy.data.result.basic_info.tenant.label);

			if (vacancy.data.result.additional_documents)
				setAdditionalDocumentLinks(vacancy.data.result.additional_documents);
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

				setRecused(individualScores.recused.value == '1' ? 1 : 0);
				setIndividualScoresComments(individualScores.comments.value);
				setIndividualTriageChoice(individualScores.recommend.value);
			}

			setRequireFocusArea(vacancy.data.result.basic_info.require_focus_area.value);
			setFocusArea(application?.focusArea);
			
			setIsLoading(false);
		} catch (error) {
			message.error('Sorry, an error occurred while loading.');
			throw error;
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

	const isChair = (userVacancyCommitteeRole) => {
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

	const isUserAllowedToScore = (userVacancyCommitteeRole) => {
		return (
			userVacancyCommitteeRole === COMMITTEE_MEMBER_VOTING ||
			userVacancyCommitteeRole === COMMITTEE_MEMBER_NON_VOTING ||
			userVacancyCommitteeRole === COMMITTEE_CHAIR
		);
	};

	const onViewApplicantsListClick = () => {
		history.push(MANAGE_VACANCY + application.vacancyId + '/applicants');
	};

	if (isLoading) {
		return <Loading />;
	} else {
		const allowHrSpecialistTriage =
			vacancyData?.basic_info?.allow_hr_specialist_triage;

		const userVacancyCommitteeRole =
			vacancyData?.user?.committee_role_of_current_vacancy;
		const userConsolidatedRoles = [...userRoles, userVacancyCommitteeRole];

		return (
			<>
				<div className='ApplicationContainer'>
					<h1>{vacancyTitle}</h1>
					<div className='ApplicationHeaderBar'>
						<h2>
							Applicant:{' '}
							{application?.basicInfo?.firstName +
								' ' +
								application?.basicInfo?.lastName}
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
							style={{ flexBasis: '670px' }}
						>
							<ApplicantInfo
								basicInfo={application?.basicInfo}
								style={{
									backgroundColor: 'white',
									minHeight: '334px',
									marginBottom: '0px',
								}}
							/>
							{(requireFocusArea !== '0') ?
								<InfoCard title='Focus Areas'
									style={{
										backgroundColor: 'white',
										minHeight: '60px',
									}}
								>
									{(requireFocusArea !== '0') ? focusArea?.map((area, index) => {
										return (
											<InfoCardRow key={index}
												style={{ paddingBottom: '5px'}}
												>
												<LabelValuePair value={area} style={{ marginBottom: '5px'}}/>
											</InfoCardRow>
										);
									}) : null}
								</InfoCard>
								:
								null
							}

							<Address
								address={application?.address}
								style={{ backgroundColor: 'white', marginBottom: '0px' }}
							/>

							{references.length === 0 ? null : (
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
									displayContactQuestion={displayReferenceContactQuestion(
										vacancyTenantType
									)}
								/>
							)}

							<Documents
								documents={application?.documents}
								style={{ backgroundColor: 'white' }}
							/>
						</div>
						<div
							className='ApplicationContentColumn'
							style={{ flexBasis: '475px' }}
						>
							{isAllowedToVacancyManagerTriage(
								userConsolidatedRoles,
								allowHrSpecialistTriage
							) || isChair(userVacancyCommitteeRole) ? (
								<>
									<TriageWidget
										title='Vacancy Manager Team Feedback'
										style={{
											backgroundColor: 'white',
											marginBottom: '0px',
										}}
										triageOptions={owmTriageOptions}
										onTriageSelect={onTriageSelect}
										onTriageCommentsChange={onTriageCommentsChange}
										onCancelClick={onTriageWidgetCancelClick}
										onSaveClick={onTriageWidgetSaveClick}
										triageChoice={triageChoice}
										triageComments={triageComments}
										triageCommentsPlaceholder={'Add notes (optional)'}
										readOnly={
											!isAllowedToVacancyManagerTriage(
												userConsolidatedRoles,
												allowHrSpecialistTriage
											)
										}
										initiallyHideContent={
											vacancyState === OWM_TRIAGE ? false : true
										}
										maxCommentLength={10000}
									/>
									<TriageWidget
										title='Committee Chair Feedback and Notes'
										style={{ backgroundColor: 'white', marginBottom: '0px' }}
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
										readOnly={
											!(
												userRoles.includes(OWM_TEAM) ||
												isChair(userVacancyCommitteeRole)
											)
										}
									/>
								</>
							) : null}

							{(isUserAllowedToScore(userVacancyCommitteeRole) &&
								!isChair(userVacancyCommitteeRole)) ||
							(isChair(userVacancyCommitteeRole) && isChairAllowedScore()) ? (
								<ScoringWidget
									title={
										isChair(userVacancyCommitteeRole)
											? 'Committee Chair Rating and Feedback'
											: 'Committee Member Rating and Feedback'
									}
									description={
										recused == 0 ? (
											<>
												Please score the applicant on a scale of 0 - 3 below and
												leave detailed notes in the comments box below.{' '}
												{ratingPlanDownloadLink ? (
													<>
														<a href={ratingPlanDownloadLink}>See Rating Plan</a>
														{'.'}
													</>
												) : null}
												<br /> <br />
												Need to recuse yourself for this applicant?{' '}
												<a onClick={openRecuseModal}>Recuse self</a>.
											</>
										) : (
											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<ExclamationCircleFilled
														style={{
															color: '#faad14',
															height: '50px',
															width: '50px',
															fontSize: '30px',
															paddingTop: '16px',
															paddingBottom: '16px',
														}}
													/>
												</div>
												<div>
													You are currently recused from scoring this applicant.{' '}
													<br />
													Need to unrecuse yourself for this applicant? <br />
													<a onClick={unrecuseSelf}>Unrecuse self</a>.{' '}
												</div>
											</div>
										)
									}
									style={{
										backgroundColor: recused == 0 ? 'white' : '#E8E8E8',
									}}
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
									disabled={recused == 1}
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

							{(isChair(userVacancyCommitteeRole) ||
								userRoles.includes(OWM_TEAM)) &&
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

							<div className='ApplicationContainerDownloadButtonGroup'>
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
								<Button>
									<a
										href={
											'/x_g_nci_app_tracke_application.do?PDF&sys_id=' +
											application?.appSysId
										}
									>
										Download Applicant Info {<DownloadOutlined />}
									</a>
								</Button>
								<Tooltip
									title={
										ratingPlanDownloadLink
											? ''
											: 'A rating plan for this vacancy has not been uploaded yet.'
									}
								>
									<Button disabled={!ratingPlanDownloadLink}>
										<a href={ratingPlanDownloadLink}>
											Download Rating Plan {<DownloadOutlined />}
										</a>
									</Button>
								</Tooltip>
								{additionalDocumentLinks.map((document, index) => {
									return (
										<Button key={index}>
											<a href={document.link}>
												{'Download ' + document.filename} <DownloadOutlined />{' '}
											</a>
										</Button>
									);
								})}
							</div>
						</div>
					</div>
				</div>
				<Modal
					visible={showRecuseModal}
					onOk={recuseSelf}
					onCancel={closeRecuseModal}
					okText='Confirm'
					cancelText='Cancel'
					confirmLoading={confirmLoading}
				>
					<div>
						<ExclamationCircleFilled
							style={{ color: '#faad14', fontSize: '24px' }}
						/>
						<h2 style={{ display: 'inline-block', paddingLeft: '10px' }}>
							Confirm recusing youself?
						</h2>
						<p>
							You are about to recuse yourself from scoring this applicant.
							Click confirm to proceed. Your scores will not count towards the
							scoring of the applicant moving forward.
						</p>
					</div>
				</Modal>
			</>
		);
	}
};

export default application;
