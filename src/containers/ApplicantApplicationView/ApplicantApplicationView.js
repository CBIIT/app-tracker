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

	const transformJsonFromBackend = (sourceJson) => {
		return {
			basicInfo: {
				firstName: sourceJson.basic_info.first_name,
				middleName: sourceJson.basic_info.middle_name,
				lastName: sourceJson.basic_info.last_name,
				email: sourceJson.basic_info.email,
				phone: sourceJson.basic_info.phone,
				businessPhone: sourceJson.basic_info.business_phone,
				highestLevelEducation: sourceJson.basic_info.highest_level_of_education,
				isUsCitizen: sourceJson.basic_info.us_citizen,
			},
			address: {
				address1: sourceJson.basic_info.address,
				address2: sourceJson.basic_info.address_2,
				city: sourceJson.basic_info.city,
				stateProvince: sourceJson.basic_info.state_province,
				postalCode: sourceJson.basic_info.zip_code,
				country: sourceJson.basic_info.country,
			},
			references: sourceJson.references.map((reference) => {
				return {
					firstName: reference.first_name,
					middleName: reference.middle_name,
					lastName: reference.last_name,
					email: reference.email,
					contactAllowed: reference.contact_allowed,
					organization: reference.organization,
					phone: reference.phone,
					relationship: reference.relationship,
					positionTitle: reference.title,
				};
			}),
			documents: sourceJson.app_documents.map((document) => {
				return {
					documentName: document.doc_name,
					fileName: document.file_name,
					downloadLink: document.attachment_dl,
				};
			}),
		};
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
								{application.documents.map((document, index) => (
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
