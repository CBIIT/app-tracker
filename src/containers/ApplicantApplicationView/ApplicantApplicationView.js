import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { message, Button } from 'antd';
import { useReactToPrint } from 'react-to-print';

import InfoCard from '../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../components/UI/InfoCard/InfoCardRow/InfoCardRow';
import LabelValuePair from '../../components/UI/LabelValuePair/LabelValuePair';
import Loading from '../../components/Loading/Loading';
import Address from '../Application/Address/Address';
import { APPLICANT_GET_APPLICATION } from '../../constants/ApiEndpoints';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend';

import './ApplicantApplicationView.css';

const applicantApplicationView = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [application, setApplication] = useState({ basicInfo: {} });
	const { appSysId } = useParams();
	const applicationRef = useRef();

	const handlePrint = useReactToPrint({
		documentTitle: `${application.basicInfo.firstName} ${application.basicInfo.lastName} application`,
		content: () => applicationRef.current,
	});

	useEffect(() => {
		(async () => {
			await getApplicationInfo();
		})();
	}, []);

	const getIsUsCitizenDisplayValue = (value) => {
		switch (value) {
			case '1':
				return 'Yes';
			case '0':
				return 'No';
			default:
				return '';
		}
	};

	const getApplicationInfo = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(APPLICANT_GET_APPLICATION + appSysId);
			setApplication(transformJsonFromBackend(response.data.result));
			setIsLoading(false);
		} catch (error) {
			message.error(
				'Sorry, there was an error loading the application.  Try refreshing the browser.'
			);
		}
	};

	return isLoading ? (
		<Loading />
	) : (
		<>
			<div className='ApplicantApplicationViewPrintButton'>
				<Button
					type='primary'
					ghost
					onClick={() => {
						handlePrint();
					}}
				>
					Print
				</Button>
			</div>
			<div ref={applicationRef}>
				<InfoCard title='Basic Information' style={props.style}>
					<InfoCardRow>
						<LabelValuePair
							label='First Name'
							value={application.basicInfo.firstName}
						/>
						<LabelValuePair
							label='Middle Name'
							value={application.basicInfo.middleName}
						/>
						<LabelValuePair
							label='Last Name'
							value={application.basicInfo.lastName}
						/>
					</InfoCardRow>
					<InfoCardRow>
						<LabelValuePair
							label='Email Address'
							value={application.basicInfo.email}
						/>
					</InfoCardRow>
					<InfoCardRow>
						<LabelValuePair label='Phone' value={application.basicInfo.phone} />
						<LabelValuePair
							label='Business Phone'
							value={application.basicInfo.businessPhone}
						/>
					</InfoCardRow>
					<InfoCardRow>
						<LabelValuePair
							containerStyle={{ width: '100%', maxWidth: '320px' }}
							label='Highest Level of Education'
							value={application.basicInfo.highestLevelEducation}
						/>
						<LabelValuePair
							label='US Citizen'
							value={getIsUsCitizenDisplayValue(
								application.basicInfo.isUsCitizen
							)}
						/>
					</InfoCardRow>
				</InfoCard>
				<Address address={application.address} />
				<InfoCard title='References'>
					{application.references.map((reference, index) => {
						return (
							<div key={index}>
								<InfoCardRow>
									<h4>Reference {index + 1}</h4>
								</InfoCardRow>
								<InfoCardRow>
									<LabelValuePair
										label='First Name'
										value={reference.firstName}
									/>
									<LabelValuePair
										label='Middle Name'
										value={reference.middleName}
									/>
									<LabelValuePair
										label='Last Name'
										value={reference.lastName}
									/>
								</InfoCardRow>
								<InfoCardRow>
									<LabelValuePair
										label='Email Address'
										value={reference.email}
									/>
								</InfoCardRow>
								<InfoCardRow>
									<LabelValuePair
										label='Phone Number'
										value={reference.phone}
									/>
									<LabelValuePair
										label='Relationship'
										value={reference.relationship}
									/>
									<LabelValuePair
										label='Position Title'
										value={reference.positionTitle}
									/>
								</InfoCardRow>
								{reference.contactAllowed ? (
									<InfoCardRow>
										<LabelValuePair
											label='Is it okay for the Hiring Team to contact the reference directly?'
											value={reference.contactAllowed}
										/>
									</InfoCardRow>
								) : null}
							</div>
						);
					})}
				</InfoCard>
				<InfoCard title='Documents'>
					<div style={{ maxWidth: '500px' }}>
						{
							<ul className='ApplicantDocumentList'>
								{application.applicantDocuments.map((document, index) => (
									<li key={index}>
										<div className='LineItemItem'>{document.documentName}</div>
										<div className='LineItemItem'>
											<a href={document.downloadLink}>{document.fileName}</a>
										</div>
									</li>
								))}
							</ul>
						}
					</div>
				</InfoCard>
			</div>
		</>
	);
};

export default applicantApplicationView;
