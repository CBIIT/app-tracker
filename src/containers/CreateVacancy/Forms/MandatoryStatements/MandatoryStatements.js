import { Form } from 'antd';
import 'react-quill/dist/quill.snow.css';

import '../../CreateVacancy.css';
import './MandatoryStatements.css';
import SwitchFormItemEditor from '../../../../components/UI/SwitchFormItemEditor/SwitchFormItemEditor';

const mandatoryStatements = () => {
	const [formInstance] = Form.useForm();

	const initialValues = {
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
	};

	return (
		<Form
			name='MandatoryStatements'
			layout='horizontal'
			requiredMark={false}
			form={formInstance}
			initialValues={initialValues}
			colon={false}
		>
			<Form.Item label='Mandatory Statements / Job Posting Statements'></Form.Item>
			<p className='SmallText'>
				What mandatory job statements would you like to include with the
				posting?
			</p>
			<SwitchFormItemEditor
				name='equalOpportunityEmployer'
				label='Equal Opportunity Employer'
				formInstance={formInstance}
			/>

			<SwitchFormItemEditor
				name='standardsOfConduct'
				label='Standards of Conduct/Financial Disclosure'
				formInstance={formInstance}
			/>

			<SwitchFormItemEditor
				name='foreignEducation'
				label='Foreign Education'
				formInstance={formInstance}
			/>

			<SwitchFormItemEditor
				name='reasonableAccomodation'
				label='Reasonable Accommodation'
				formInstance={formInstance}
			/>
		</Form>
	);
};

export default mandatoryStatements;
