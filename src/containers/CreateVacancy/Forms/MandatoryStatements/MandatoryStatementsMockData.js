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

export const mockBasicInfoWithReferenceCollection = {
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
	referenceCollection: true,
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
		text: '<p>Dear Dr. #Candidate First And Last Name#,</p><br><p>We have received the application you submitted for the #Position Title# position with #IC#, National Institutes of Health.</p><p>We wanted to let you know how much we appreciated the opportunity to review your application.  While we will no longer be considering you for this position, we encourage you to continue to apply for other positions at the NIH in areas that you have interest.</p><p>Best wishes in your future career endeavors.</p><br><p>Sincerely,</p><p>#IC#</p><p>National Institutes of Health</p>',
	},
	{
		type: 'Candidates Who Did Interviewed',
		active: true,
		text: '<p>Dear Dr. #Candidate First And Last Name#,</p><br><p>Thank you for interviewing for the #Position Title# position with #IC#, National Institutes of Health.</p><p>We enjoyed the opportunity to interview you and hear your views regarding the #Position Title# position. After a much difficult discussion, we are no longer considering you for this position. We encourage you to continue to apply for other positions at the NIH in areas that you have interest.</p><p>Thank you again for your interest in this position.</p><br><p>Sincerely,</p><p>#IC#</p><p>National Institutes of Health</p>',
	},
	{
		type: 'Applicant Reference Request',
		active: true,
		text: "<p>Dear Dr. #REF_LAST_NAME#,</p><p>Dr. #APP_FIRST_NAME# #APP_LAST_NAME# has applied for #POSITION# at the #IC#, National Institutes of Health and has provided your name as one of their references. We would be grateful if you could submit a letter in support of Dr. #APP_LAST_NAME#'s application.</p><p>You may upload your letter by responding to this email with your reference letter added as an attachment. Word and PDF files are accepted. The email address used to send this request to you can only accept the file submission. It cannot accept email text. If you need to communicate with the Executive Secretary about the reference request, please find their email address at the bottom of this message or on the vacancy page and contact them directly.</p><p>Your letter should address the candidate's strengths and weaknesses, the potential for success in this position, and any other information you feel the Search Committee would find helpful in considering this application. A link to the position listing follows below, for your information. All comments in your letter will be held confidential.</p><p>Application Vacancy: #VACANCY_URL#</p><p>The deadline for submitting letters is <strong>#REF_COLLECTION_DATE#</strong>.</p><p>Please use this email system to upload your letter of recommendation. This will assure that your letter immediately becomes part of the applicant's package, as well as provide an acknowledgment to the applicant that your letter has been received.</p><p>On behalf of the Search Committee, we thank you for your support.</p><p>Regards,</p><p>#VACANCY_POC#<br />#VACANCY_POC_EMAIL#</p>",
	},
	{
		type: 'Applicant Reference Received',
		active: true,
		text: "<p>Dear Dr. #REF_LAST_NAME#,</p><p>Thank you for providing a letter of reference in support of Dr. #APP_LAST_NAME#'s application for #POSITION# at the #IC#, National Institutes of Health.</p><p>We realize that providing a letter for someone being considered for this type of position takes a significant amount of time, so we are quite thankful for your willingness to provide us your insights regarding the candidate. All comments in your letter will be held confidential.</p><p>On behalf of the Search Committee, we thank you for your support.</p><p>Regards,<br />#VACANCY_POC#<br />#VACANCY_POC_EMAIL#</p>",
	},
	{
		type: 'Applicant Reference Received - Applicant',
		active: true,
		text: '<p>Dear Dr. #APPLICANT_LAST_NAME#,</p><p>This email is to notify you that we have received a letter from Dr. #REF_LAST_NAME# in support of your application for #POSITION# at the #IC#, National Institutes of Health.</p><p>Regards,<br />#EXECUTIVE_SECRETARY#<br />#EXECUTIVE_SECRETARY_EMAIL#</p>',
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

export const mockVacancyCommittee = [];
