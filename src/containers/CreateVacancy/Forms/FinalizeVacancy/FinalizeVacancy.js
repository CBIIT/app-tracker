import { Space, Table } from 'antd';
import ReactQuill from 'react-quill';
import SectionHeader from '../../../../components/UI/ReviewSectionHeader/ReviewSectionHeader';
import './FinalizeVacancy.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GET_VACANCY_OPTIONS } from '../../../../constants/ApiEndpoints';
import useAuth from '../../../../hooks/useAuth';
import { LoadingOutlined } from '@ant-design/icons';

const finalizeVacancy = (props) => {
	const { basicInfo, mandatoryStatements, vacancyCommittee, emailTemplates } =
		props.allForms;
	const { auth, currentTenant } = useAuth();
	const { tenants } = auth;
	const tname = tenants ? tenants.find((t) => t.value === currentTenant) : {};
	const readOnlyMember = props.readOnlyMember;
	const [allPackageInitiators, setAllPackageInitiators] = useState('');
	const [loading, setLoading] = useState(false);
	const errors = props.errorSections;
	const vacancyCommitteeColumns = [
		{
			title: 'Committee Member',
			dataIndex: ['user', 'name', 'value'],
			key: 'key',
		},
		{ title: 'Role', dataIndex: 'role', key: 'role' },
	];
	useEffect(() => {
		setLoading(true);
		(async () => {
			const vacancyOptionsResponse = await axios.get(GET_VACANCY_OPTIONS);
			if (vacancyOptionsResponse && vacancyOptionsResponse.data && vacancyOptionsResponse.data.result) {
				setAllPackageInitiators(
					vacancyOptionsResponse.data.result.package_initiators
				);
			}
			setLoading(false);
		})();
	}, []);

	function getPackageInitiatorDisplayName() {
		let displayName = '';
		for (let i = 0; i < allPackageInitiators.length; i++) {
			let packageInitiator = allPackageInitiators[i];
			if (packageInitiator.sys_id === basicInfo.appointmentPackageIndicator)
				displayName = packageInitiator.name;
		}
		return displayName;
	}

	function getVacancyPocDisplay() {
		const display = {};
		for (let i = 0; i < allPackageInitiators.length; i++) {
			let poc = allPackageInitiators[i];
			if (poc.sys_id === basicInfo.vacancyPoc) {
				(display.name = poc.name), (display.email = poc.email);
			}
		}
		return display;
	}

	let vacancyPocDisplay = {};

	if (basicInfo && basicInfo.vacancyPocType?.includes('Both')) {
		for (let i = 0; i < allPackageInitiators.length; i++) {
			let poc = allPackageInitiators[i];
			if (poc.sys_id === basicInfo.vacancyPoc) {
				(vacancyPocDisplay.name = `Name: ${poc.name}, Email:  ${poc.email}`);
			}
		}
		vacancyPocDisplay.email = `Email: ${basicInfo.vacancyPocEmail}`;
	} else if (basicInfo && basicInfo.vacancyPocType?.includes('Email Distribution List')) {
		(vacancyPocDisplay.email = basicInfo.vacancyPocEmail);
	} else {
		vacancyPocDisplay = getVacancyPocDisplay();
	}

	return (
		<>
			<SectionHeader
				title='Basic Vacancy Information'
				onClick={() => props.onEditButtonClick(0)}
				showButton={props.showButton}
				error={errors?.includes('Basic Vacancy Information')}
			/>
			<div className='SectionContent' style={props.sectionContentStyle}>
				<div style={{ display: 'flex', flexFlow: 'row wrap', gap: '40px' }}>
					<div>
						<h2>Vacancy Title</h2>
						<p>{basicInfo && basicInfo.title}</p>
					</div>
					<div>
						<h2>Utilize a Set Close Date</h2>
						<p>{basicInfo && basicInfo.useCloseDate ? 'Yes' : 'No'}</p>
					</div>
				</div>
				<div>
					<h2>Allow HR Specialist to Triage</h2>
					<p>{basicInfo && basicInfo.allowHrSpecialistTriage ? 'Yes' : 'No'}</p>
				</div>
				<h2 style={basicInfo && basicInfo.description ? null : { color: 'red' }}>
					{basicInfo && basicInfo.description ? null : '! '}Vacancy Description
				</h2>
				<ReactQuill
					className='RichTextDisplay'
					value={basicInfo ? basicInfo.description : ''}
					readOnly={true}
					theme={'bubble'}
				/>
				<div>
					<h2 style={basicInfo && basicInfo.vacancyPoc ? null : { color: 'red' }}>
						{basicInfo && basicInfo.vacancyPoc ? null : '! '}Vacancy Point of Contact
						Information
					</h2>

					<div>
						{loading ? (
							<Space
								block='true'
								style={{ display: 'flex', marginLeft: '75px' }}
							>
								<LoadingOutlined style={{ fontSize: '2rem' }} />
							</Space>
						) : (
							<p>
								{vacancyPocDisplay.name}
								<br />
								{vacancyPocDisplay.email}
							</p>
						)}
					</div>
				</div>
				<div className='DateSection'>
					<div className='DateCard'>
						<h2 style={basicInfo && basicInfo.openDate ? null : { color: 'red' }}>
							{basicInfo && basicInfo.openDate ? null : '! '}Open Date
						</h2>
						<p>
							{basicInfo && basicInfo.openDate
								? new Date(basicInfo.openDate)
									.toLocaleString('en-us', { timeZone: 'UTC' })
									.split(',')[0]
								: null}
						</p>
					</div>
					{basicInfo && basicInfo.useCloseDate && (
						<div className='DateCard'>
							<h2 style={basicInfo.closeDate ? null : { color: 'red' }}>
								{basicInfo && basicInfo.closeDate ? null : '! '}Close Date
							</h2>
							<p>
								{basicInfo && basicInfo.closeDate
									? new Date(basicInfo.closeDate)
										.toLocaleString('en-us', { timeZone: 'UTC' })
										.split(',')[0]
									: null}
							</p>
						</div>
					)}
				</div>
				{basicInfo && basicInfo.closeDate && (
					<div className='DateSection'>
						<div className='DateCard'>
							<h2>Scoring Due By Date</h2>
							<p>
								{basicInfo.scoringDueByDate
									? new Date(basicInfo.scoringDueByDate)
										.toLocaleString('en-us', { timeZone: 'UTC' })
										.split(',')[0]
									: ''}
							</p>
						</div>
					</div>
				)}
				{basicInfo && basicInfo.location && (
					<div className='LocationCard'>
						<h2>
							{basicInfo && basicInfo.location ? null : '! '}Location
						</h2>
						<p>
							{basicInfo && basicInfo.location
								? basicInfo.location
								: null}
						</p>
					</div>
				)}
				{tname && tname.label && tname.label.trim().toLowerCase() === 'stadtman' ? (
					<div style={{ display: 'flex', flexFlow: 'row wrap', gap: '40px' }}>
						<div>
							<h2>Focus Area</h2>
							<p>{basicInfo.requireFocusArea ? 'Visible' : 'Not Visible'}</p>
						</div>
					</div>
				) : (
					''
				)}
				<h2>Application Documents</h2>
				<ul>
					{basicInfo && basicInfo.applicationDocuments.map((element, index) => (
						<li key={index} className='ListItemTrue'>
							{element.document}
							{element.isDocumentOptional ? ' (optional)' : ''}
						</li>
					))}
				</ul>
				<div>
					<h2>Reference Collection</h2>
					<p>{basicInfo && basicInfo.referenceCollection ? 'Yes' : 'No'}</p>
				</div>
				{basicInfo && basicInfo.referenceCollection && (
					<div className='DateCard'>
						<h2>Reference Collection Date</h2>
						<p>
							{basicInfo.referenceCollectionDate
								? new Date(basicInfo.referenceCollectionDate)
										.toLocaleString('en-us', { timeZone: 'UTC' })
										.split(',')[0]
								: ''}
						</p>
					</div>
				)}
				<h2>Full Contact Details for References</h2>
				<h3>How many recommendations does this vacancy require?</h3>
				<ul>
					<li className='ListItemTrue'>
						{basicInfo && basicInfo.numberOfRecommendations} recommendation(s)
					</li>
				</ul>

				{readOnlyMember ? null : <div>	<h2>Number of Scoring Categories</h2>
					<h3>How many categories does this vacancy require for scoring?</h3>
					<ul>
						<li className='ListItemTrue'>
							{basicInfo && basicInfo.numberOfCategories} categories
						</li>
					</ul></div>}
				<h2 style={basicInfo && basicInfo.sacCode ? null : { color: 'red' }}>
					{basicInfo && basicInfo.sacCode ? null : '! '}Organizational Code
				</h2>
				<ul>
					<li className='ListItemTrue'>{basicInfo && basicInfo.sacCode}</li>
				</ul>
				<h2 style={basicInfo && basicInfo.positionClassification ? null : { color: 'red' }}>
					{basicInfo && basicInfo.positionClassification ? null : '! '}Position
					Classification
				</h2>
				<ul>
					<li className='ListItemTrue'>{basicInfo && basicInfo.positionClassification}</li>
				</ul>
				<div><h2>Personnel Action Tracking Solution (PATS) Initiator</h2>
					<ul>
						{loading ? (
							<Space block='true' style={{ display: 'flex', marginLeft: '75px' }}>
								<LoadingOutlined style={{ fontSize: '2rem' }} />
							</Space>
						) : (
							<li className='ListItemTrue'>
								{basicInfo && getPackageInitiatorDisplayName(
									basicInfo.appointmentPackageIndicator,
									allPackageInitiators
								)}
							</li>
						)}
					</ul></div>
			</div>
			{readOnlyMember ? null : <div>
				<SectionHeader
					title='Mandatory Statements'
					onClick={() => props.onEditButtonClick(1)}
					showButton={props.showButton}
					error={errors?.includes('Mandatory Statements')}
				/>
				<div className='SectionContent' style={props.sectionContentStyle}>
					<div className='TwoColumnCheckList'>
						<ul>
							<li
								className={
									mandatoryStatements && mandatoryStatements.equalOpportunityEmployer
										? 'ListItemTrue'
										: 'ListItemFalse'
								}
							>
								Equal Opportunity Employment
							</li>
							<li
								className={
									mandatoryStatements && mandatoryStatements.standardsOfConduct
										? 'ListItemTrue'
										: 'ListItemFalse'
								}
							>
								Standards of Conduct/Financial Disclosure
							</li>
							<li
								className={
									mandatoryStatements && mandatoryStatements.foreignEducation
										? 'ListItemTrue'
										: 'ListItemFalse'
								}
							>
								Foreign Education
							</li>
							<li
								className={
									mandatoryStatements && mandatoryStatements.reasonableAccomodation
										? 'ListItemTrue'
										: 'ListItemFalse'
								}
							>
								Reasonable Accomodation
							</li>
						</ul>
					</div>
				</div>
			</div>}
			{props.hideCommitteeSection || readOnlyMember ? null : (
				<>
					<SectionHeader
						title='Vacancy Committee'
						onClick={() => props.onEditButtonClick(2)}
						showButton={props.showButton}
						error={errors?.includes('Vacancy Committee')}
					/>
					<div className='SectionContent' style={props.sectionContentStyle}>
						<Table
							pagination={{ hideOnSinglePage: true }}
							locale={{
								emptyText: 'Currently no committee members selected.',
							}}
							dataSource={vacancyCommittee &&
								Object.keys(vacancyCommittee).length === 0
									? null
									: vacancyCommittee
							}
							columns={vacancyCommitteeColumns}
						/>
					</div>
				</>
			)}
			{props.hideEmails || readOnlyMember ? null : (
				<>
					<SectionHeader
						title='Email Templates'
						onClick={() => props.onEditButtonClick(3)}
						showButton={props.showButton}
						error={errors?.includes('Email Templates')}
					/>
					<div className='SectionContent' style={props.sectionContentStyle}>
						<div className='TwoColumnCheckList'>
							<ul className='TwoColumnChecklist'>
								{emailTemplates && emailTemplates.map((template, index) => (
									<li
										key={index}
										className={
											template.active ? 'ListItemTrue' : 'ListItemFalse'
										}
									>
										{template.type}
									</li>
								))}
							</ul>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default finalizeVacancy;
