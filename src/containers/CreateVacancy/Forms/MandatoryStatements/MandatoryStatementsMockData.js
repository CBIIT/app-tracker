export const mockBasicInfo = {
	allowHrSpecialistTriage: false,
	applicationDocuments: [
		{
			document: 'Curriculum Vitae (CV)',
			isDocumentOptional: false,
		},
		{
			document: 'Cover Letter',
			isDocumentOptional: true,
		},
		{
			document: 'Vision Statement',
			isDocumentOptional: false,
		},
		{
			document: 'Qualification Statement',
			isDocumentOptional: false,
		},
	],
    appointmentPackageIndicator: '12345',
    description: 'This is a description',
    isUserPOC: true,
    numberOfCategories: 2,
    numberOfRecommendations: 3,
    openDate: 'Mon Mar 17 2025 12:35:43 GMT-0500 (Central Daylight Time)',
    positionClassification: 'Research',
    referenceCollection: false,
    sacCode: 'HHH',
    title: 'Test Vacancy',
    useCloseDate: undefined,
};

export const mockEmailTemplates = [
	{
		type: 'Application saved',
		active: true,
		text: '<p>Dear Dr. #APP_LAST_NAME#,<br><br></p><p>Thank you for your application for the position of #POSITION# at the #IC#, National Institutes of Health. Your application has been saved and is available at #APP_URL#.<br><br></p><p>Please ensure that all application materials are submitted by the review date/application deadline. Incomplete applications will not be considered. You may view the status of your application materials. If you should have any questions, please contact #VACANCY_POC_NAME#.<br><br></p><p>Thank you for your interest in the National Institutes of Health.<br></p>',
	},
	{
		type: 'Application submitted confirmation',
		active: true,
		text: '<p>Dear Dr. #APP_LAST_NAME#, <br><br></p><p>Good news! Your application for the position of #POSITION# at the #IC#, National Institutes of Health <b>has been submitted.</b></p><p>You may view the status of your application at any time by following #APP_URL#.</p><p>If you should have any questions, please contact #VACANCY_POC_NAME#.  </p><p>Thank you for your interest in the National Institutes of Health.</p>',
	},
	{
		type: 'Candidates Who Did Not Interview',
		active: true,
		text: "<p>Dear Dr. #Candidate First And Last Name#,</p><br><p>We have received the application you submitted for the #Position Title# position with #IC#, National Institutes of Health.</p><p>We wanted to let you know how much we appreciated the opportunity to review your application.  While we will no longer be considering you for this position, we encourage you to continue to apply for other positions at the NIH in areas that you have interest.</p><p>Best wishes in your future career endeavors.</p><br><p>Sincerely,</p><p>#IC#</p><p>National Institutes of Health</p>"
	},
	{
		type: 'Candidates Who Did Interviewed',
		active: true,
		text: "<p>Dear Dr. #Candidate First And Last Name#,</p><br><p>Thank you for interviewing for the #Position Title# position with #IC#, National Institutes of Health.</p><p>We enjoyed the opportunity to interview you and hear your views regarding the #Position Title# position. After a much difficult discussion, we are no longer considering you for this position. We encourage you to continue to apply for other positions at the NIH in areas that you have interest.</p><p>Thank you again for your interest in this position.</p><br><p>Sincerely,</p><p>#IC#</p><p>National Institutes of Health</p>"
	},
];

export const mockMandatoryStatements = {
	equalOpportunityEmployer: true,
	equalOpportunityEmployerText:
		'<p>The United States government does not discriminate in employment on the basis of race, color, religion, sex, pregnancy, national origin, political affiliation, sexual orientation, marital status, disability, genetic information, age, membership in an employee organization, retaliation, parental status, military service or other non-merit factor.</p><br/><p>To learn more, please visit the <a href="https://www.eeoc.gov/federal-sector/federal-employees-job-applicants">U.S. Equal Employment Opportunity Commission</a>.</p>',
	standardsOfConduct: true,
	standardsOfConductText:
		'<p>The National Institutes of Health inspires public confidence in our science by maintaining high ethical principles. NIH employees are subject to Federal government-wide regulations and statutes as well as agency-specific regulations described at the NIH Ethics Website. We encourage you to review this information. The position is subject to a background investigation and requires the incumbent to complete a public financial disclosure report prior to the effective date of the appointment.</p>',
	foreignEducation: true,
	foreignEducationText:
		'<p>Applicants who have completed part or all of their education outside of the U.S. must have their foreign education evaluated by an accredited organization to ensure that the foreign education is equivalent to education received in accredited educational institutions in the United States. We will only accept the completed foreign education evaluation. For more information on foreign education verification, visit the https://www.naces.org website. Verification must be received prior to the effective date of the appointment.</p>',
	reasonableAccomodation: true,
	reasonableAccomodationText:
		'<p>NIH provides reasonable accommodations to applicants with disabilities. If you require reasonable accommodation during any part of the application and hiring process, please notify us. The decision on granting reasonable accommodation will be made on a case-by-case basis.</p>',
};
	
export const mockVacancyCommittee= [];

