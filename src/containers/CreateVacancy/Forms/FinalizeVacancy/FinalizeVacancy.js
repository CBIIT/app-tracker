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
	const { auth } = useAuth();
	const { user } = auth;
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
			setAllPackageInitiators(
				vacancyOptionsResponse.data.result.package_initiators
			);
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

	const vacancyPocDisplay = getVacancyPocDisplay();

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
						<p>{basicInfo.title}</p>
					</div>
					<div>
						<h2>Utilize a Set Close Date</h2>
						<p>{basicInfo.useCloseDate ? 'Yes' : 'No'}</p>
					</div>
				</div>
				<div>
					<h2>Allow HR Specialist to Triage</h2>
					<p>{basicInfo.allowHrSpecialistTriage ? 'Yes' : 'No'}</p>
				</div>
				<h2 style={basicInfo.description ? null : { color: 'red' }}>
					{basicInfo.description ? null : '! '}Vacancy Description
				</h2>
				<ReactQuill
					className='RichTextDisplay'
					value={basicInfo.description}
					readOnly={true}
					theme={'bubble'}
				/>
				<div>
					<h2 style={basicInfo.vacancyPoc ? null : { color: 'red' }}>
						{basicInfo.vacancyPoc ? null : '! '}Vacancy Point of Contact
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
						<h2 style={basicInfo.openDate ? null : { color: 'red' }}>
							{basicInfo.openDate ? null : '! '}Open Date
						</h2>
						<p>
							{basicInfo.openDate
								? new Date(basicInfo.openDate)
										.toLocaleString('en-us')
										.split(',')[0]
								: null}
						</p>
					</div>
					{basicInfo.useCloseDate && (
						<div className='DateCard'>
							<h2 style={basicInfo.closeDate ? null : { color: 'red' }}>
								{basicInfo.closeDate ? null : '! '}Close Date
							</h2>
							<p>
								{basicInfo.closeDate
									? new Date(basicInfo.closeDate)
											.toLocaleString('en-us')
											.split(',')[0]
									: null}
							</p>
						</div>
					)}
				</div>
				{basicInfo.closeDate && (
					<div className='DateSection'>
						<div className='DateCard'>
							<h2>Scoring Due By Date</h2>
							<p>
								{basicInfo.scoringDueByDate
									? new Date(basicInfo.scoringDueByDate)
											.toLocaleString('en-us')
											.split(',')[0]
									: ''}
							</p>
						</div>
					</div>
				)}
				{user?.tenant?.trim().toLowerCase() === 'stadtman' ? (
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
					{basicInfo.applicationDocuments.map((element, index) => (
						<li key={index} className='ListItemTrue'>
							{element.document}
							{element.isDocumentOptional ? ' (optional)' : ''}
						</li>
					))}
				</ul>
				<h2>Full Contact Details for References</h2>
				<h3>How many recommendations does this vacancy require?</h3>
				<ul>
					<li className='ListItemTrue'>
						{basicInfo.numberOfRecommendations} recommendation(s)
					</li>
				</ul>
				<h2>Number of Scoring Categories</h2>
				<h3>How many categories does this vacancy require for scoring?</h3>
				<ul>
					<li className='ListItemTrue'>
						{basicInfo.numberOfCategories} categories
					</li>
				</ul>
				<h2 style={basicInfo.sacCode ? null : { color: 'red' }}>
					{basicInfo.sacCode ? null : '! '}Organizational Code
				</h2>
				<ul>
					<p className='ListItemTrue'>{basicInfo.sacCode}</p>
				</ul>
				<h2 style={basicInfo.positionClassification ? null : { color: 'red' }}>
					{basicInfo.positionClassification ? null : '! '}Position
					Classification
				</h2>
				<ul>
					<p className='ListItemTrue'>{basicInfo.positionClassification}</p>
				</ul>
				<h2>Personnel Action Tracking Solution (PATS) Initiator</h2>
				<ul>
					{loading ? (
						<Space
							block='true'
							style={{ display: 'flex', marginLeft: '75px' }}
						>
							<LoadingOutlined style={{ fontSize: '2rem' }} />
						</Space>
					) : (
						<p className='ListItemTrue'>
							{getPackageInitiatorDisplayName(
								basicInfo.appointmentPackageIndicator,
								allPackageInitiators
							)}
						</p>
					)}
				</ul>
			</div>
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
								mandatoryStatements.equalOpportunityEmployer
									? 'ListItemTrue'
									: 'ListItemFalse'
							}
						>
							Equal Opportunity Employment
						</li>
						<li
							className={
								mandatoryStatements.standardsOfConduct
									? 'ListItemTrue'
									: 'ListItemFalse'
							}
						>
							Standards of Conduct/Financial Disclosure
						</li>
						<li
							className={
								mandatoryStatements.foreignEducation
									? 'ListItemTrue'
									: 'ListItemFalse'
							}
						>
							Foreign Education
						</li>
						<li
							className={
								mandatoryStatements.reasonableAccomodation
									? 'ListItemTrue'
									: 'ListItemFalse'
							}
						>
							Reasonable Accomodation
						</li>
					</ul>
				</div>
			</div>
			{props.hideCommitteeSection ? null : (
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
							dataSource={
								Object.keys(vacancyCommittee).length === 0
									? null
									: vacancyCommittee
							}
							columns={vacancyCommitteeColumns}
						/>
					</div>
				</>
			)}
			{props.hideEmails ? null : (
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
								{emailTemplates.map((template, index) => (
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
