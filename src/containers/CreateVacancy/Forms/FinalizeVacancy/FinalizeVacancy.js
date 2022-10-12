import { Table } from 'antd';
import ReactQuill from 'react-quill';
import SectionHeader from '../../../../components/UI/ReviewSectionHeader/ReviewSectionHeader';
import './FinalizeVacancy.css';

const finalizeVacancy = (props) => {
	const { basicInfo, mandatoryStatements, vacancyCommittee, emailTemplates } =
		props.allForms;

	const vacancyCommitteeColumns = [
		{
			title: 'Committee Member',
			dataIndex: ['user', 'name', 'value'],
			key: 'key',
		},
		{ title: 'Role', dataIndex: 'role', key: 'role' },
	];

	return (
		<>
			<SectionHeader
				title='Basic Vacancy Information'
				onClick={() => props.onEditButtonClick(0)}
				showButton={props.showButton}
			/>
			<div className='SectionContent' style={props.sectionContentStyle}>
				<h2>Vacancy Title</h2>
				<p>{basicInfo.title}</p>
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
