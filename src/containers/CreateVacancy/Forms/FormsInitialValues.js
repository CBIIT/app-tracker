export const initialValues = {
	basicInfo: {
		numberOfRecommendations: 3,
		description: '',
		applicationDocuments: [
			{
				document: 'Curriculum Vitae (CV)',
			},
			{
				document: 'Cover Letter',
				isDocumentOptional: true,
			},
			{
				document: 'Vision Statement',
			},
			{
				document: 'Qualification Statement',
			},
		],
	},
	mandatoryStatements: {
		equalOpportunityEmployer: true,
		equalOpportunityEmployerText:
			'<p>Selection for this position will be based solely on merit, with no discrimination for non-merit reasons such as race, color, religion, gender, sexual orientation, national origin, political affiliation, marital status, disability, age, or membership or non-membership in an employee organization.&nbsp;The NIH encourages the application and nomination of qualified women, minorities, and individuals with disabilities.</p>',
		standardsOfConduct: true,
		standardsOfConductText:
			'<p>The National Institutes of Health inspires public confidence in our science by maintaining high ethical principles. NIH employees are subject to Federal government-wide regulations and statutes as well as agency-specific regulations described at the NIH Ethics Website. We encourage you to review this information. The position is subject to a background investigation and requires the incumbent to complete a public financial disclosure report prior to the effective date of the appointment.</p>',
		foreignEducation: true,
		foreignEducationText:
			'<p>Applicants who have completed part or all of their education outside of the U.S. must have their foreign education evaluated by an accredited organization to ensure that the foreign education is equivalent to education received in accredited educational institutions in the United States. We will only accept the completed foreign education evaluation. For more information on foreign education verification, visit the https://www.naces.org website. Verification must be received prior to the effective date of the appointment.</p>',
		reasonableAccomodation: true,
		reasonableAccomodationText:
			'<p>NIH provides reasonable accommodations to applicants with disabilities. If you require reasonable accommodation during any part of the application and hiring process, please notify us. The decision on granting reasonable accommodation will be made on a case-by-case basis.</p>',
	},
	vacancyCommittee: [],
	emailTemplates: [
		{
			type: 'Application saved',
			active: true,
			text: '<p>Dear Dr. #APP_LAST_NAME#,</p><p>Thank you for your application for the position of #POSITION# at the ***DOC*** National Cancer Institute (NCI).</p><p>Your application has been saved and is available at #APP_URL#.&nbsp;</p><p>Please ensure that all application materials are submitted by the review date/application deadline. Incomplete applications will not be considered. You may view the status of your application materials -- If you should have any questions, please contact ______. Thank you for your interest in the National Cancer Institute.</p>',
		},
		{
			type: 'Application submitted confirmation',
			active: true,
			text: "<p><span>Dear Dr. #APP_LAST_NAME#,</span></p><p><span>Good news! Your application for the position of #POSITION# at the ***DOC*** National Cancer Institute's (NCI) </span><strong>has been submitted.</strong></p><p><span>You may view the status of your application at any time by following #APP_URL#.</span></p><p><span>If you should have any questions, please contact ____. Thank you for your interest in the National Cancer Institute.</span></p>",
		},
	],
};
