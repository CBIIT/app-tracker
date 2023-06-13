import { Table } from 'antd';
import ReactQuill from 'react-quill';
import SectionHeader from '../../../../components/UI/ReviewSectionHeader/ReviewSectionHeader';
import './FinalizeVacancy.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GET_VACANCY_OPTIONS } from '../../../../constants/ApiEndpoints';

const finalizeVacancy = (props) => {
	const { basicInfo, mandatoryStatements, vacancyCommittee, emailTemplates } =
		props.allForms;
	const [allPackageInitiators, setAllPackageInitiators] = useState('');

	const vacancyCommitteeColumns = [
		{
			title: 'Committee Member',
			dataIndex: ['user', 'name', 'value'],
			key: 'key',
		},
		{ title: 'Role', dataIndex: 'role', key: 'role' },
	];

	useEffect(() => {
		// since appointment package inititator only displays the sys_id, do a GET to figure out what the display of it should be
		(async () => {
			const vacancyOptionsResponse = await axios.get(
				GET_VACANCY_OPTIONS
			);
			setAllPackageInitiators(vacancyOptionsResponse.data.result.packageInitiators);
		})();
	}, []);

	function getPackageInitiatorDisplayName() {
		var displayName = '';
		for(var i = 0; i < allPackageInitiators.length; i++) {
			var packageInitiator = allPackageInitiators[i];
			if (packageInitiator.sys_id === basicInfo.appointmentPackageIndicator)
				displayName = packageInitiator.name;
		}
		return displayName;
	}

	return (
		<>
			<SectionHeader
				title='Basic Vacancy Information'
				onClick={() => props.onEditButtonClick(0)}
				showButton={props.showButton}
			/>
			<div className='SectionContent' style={props.sectionContentStyle}>
				<div style={{ display: 'flex', flexFlow: 'row wrap', gap: '40px' }}>
					<div>
						<h2>Vacancy Title</h2>
						<p>{basicInfo.title}</p>
					</div>
					<div>
						<h2>Allow HR Specialist to Triage</h2>
						<p>{basicInfo.allowHrSpecialistTriage ? 'Yes' : 'No'}</p>
					</div>
				</div>
				<div style={{ display: 'flex', flexFlow: 'row wrap', gap: '40px' }}>
					<div>
						<h2>Focus Area</h2>
						<p>{(basicInfo.requireFocusArea) ? 'Visible' : 'Not Visible'}</p>
					</div>
				</div>
				<h2>Vacancy Description</h2>
				<ReactQuill
					className='RichTextDisplay'
					value={basicInfo.description}
					readOnly={true}
					theme={'bubble'}
				/>
				<div className='DateSection'>
					<div className='DateCard'>
						<h2>Open Date</h2>
						<p>
							{basicInfo.openDate
								? new Date(basicInfo.openDate)
										.toLocaleString('en-us')
										.split(',')[0]
								: null}
						</p>
					</div>
					<div className='DateCard'>
						<h2>Close Date</h2>
						<p>
							{basicInfo.closeDate
								? new Date(basicInfo.closeDate)
										.toLocaleString('en-us')
										.split(',')[0]
								: null}
						</p>
					</div>
				</div>
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
				<h2>Application Documents</h2>
				<ul>
					{basicInfo.applicationDocuments.map((element, index) => (
						<li key={index} className='ListItemTrue'>
							{element.document}
							{element.isDocumentOptional ? ' (optional)' : ''}
						</li>
					))}
				</ul>
				<h2>Letters of Recommendations</h2>
				<h3>How many recommendations does this vacancy require?</h3>
				<ul>
					<li className='ListItemTrue'>
						{basicInfo.numberOfRecommendations} recommendations
					</li>
				</ul>
				<h2>Position Classification</h2>
				<ul>
					<p>
						{basicInfo.positionClassification} 
					</p>
				</ul>
				<h2>Appointment Package Initiator</h2>
				<ul>
					<p>
						{getPackageInitiatorDisplayName(basicInfo.appointmentPackageIndicator, allPackageInitiators)} 
					</p>
				</ul>
			</div>
			<SectionHeader
				title='Mandatory Statements'
				onClick={() => props.onEditButtonClick(1)}
				showButton={props.showButton}
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
