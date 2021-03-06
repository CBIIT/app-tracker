import LabelValuePair from '../../../components/UI/LabelValuePair/LabelValuePair';
import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../../components/UI/InfoCard/InfoCardRow/InfoCardRow';

import './ApplicantInfo.css';

const applicantInfo = (props) => {
	const basicInfo = props.basicInfo;

	return (
		<InfoCard title='Applicant Information' style={props.style}>
			<InfoCardRow>
				<LabelValuePair label='First Name' value={basicInfo.firstName} />
				<LabelValuePair label='Middle Name' value={basicInfo.middleName} />
				<LabelValuePair label='Last Name' value={basicInfo.lastName} />
			</InfoCardRow>
			<InfoCardRow>
				<LabelValuePair label='Email Address' value={basicInfo.email} />
			</InfoCardRow>
			<InfoCardRow>
				<LabelValuePair label='Phone' value={basicInfo.phone} />
				<LabelValuePair
					label='Business Phone'
					value={basicInfo.businessPhone}
				/>
			</InfoCardRow>
		</InfoCard>
	);
};

export default applicantInfo;
