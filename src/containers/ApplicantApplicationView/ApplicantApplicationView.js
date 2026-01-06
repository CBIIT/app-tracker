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
import {
	REQUEST_REFERENCE
} from '../../constants/ApiEndpoints';
import useAuth from '../../hooks/useAuth';
import ReferenceModal from './ReferenceModal/ReferenceModal';

import './ApplicantApplicationView.css';

const applicantApplicationView = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [application, setApplication] = useState({ basicInfo: {} });
	const [referenceModal, setReferenceModal] = useState(false);
	const [referencesRequested, setReferencesRequested] = useState(0);
	const [refSysId, setRefSysId] = useState('');
	const { appSysId } = useParams();
	const applicationRef = useRef();

	const { auth: { tenants } } = useAuth();
	const tname = tenants ? tenants.find((t) => t.value === application.tenant) : {};
	const maxApplicantReferenceRequests = (tname?.properties || []).find(
		(p) => p.name === 'maxApplicantReferenceRequests'
	)?.value;

	const infoCardStyle = { paddingBottom: '0px' };
	const referenceInfoCardContentStyle = {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		gap: '10px',
	};

	const labelStyle = { fontWeight: 'bold' };

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

	const onCollectReferenceButtonClick = async (sysId, referenceRequested) => {
		setRefSysId(sysId);
		setReferencesRequested(referenceRequested);
		setReferenceModal(true);
	};

	const requestReference = async (sysId) => {
		try {
			const response = await axios.get(REQUEST_REFERENCE + sysId);
			message.success(response.data.result.message);
		} catch (e) {
			message.error(
				'Sorry, there was an error sending the notifications to the references.  Try refreshing the browser.'
			);
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

	const reloadApplicationInfo = async () => {
		try {
			const response = await axios.get(APPLICANT_GET_APPLICATION + appSysId);
			setApplication(transformJsonFromBackend(response.data.result));
		} catch (error) {
			message.error(
				'Sorry, there was an error reloading the application.  Try refreshing the browser.'
			);
		}
	}

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
				<div style={{ display: 'flex' }}>
					<div style={{ width: '60%' }}>
						<InfoCard title='Basic Information' style={{ padding: '2px' }} >
							<InfoCardRow style={infoCardStyle}>
								<LabelValuePair
									containerStyle={{ marginRight: '0px' }}
									labelStyle={labelStyle}
									label='Name'
									value={`${application.basicInfo.firstName} ${application.basicInfo.middleName ? application.basicInfo.middleName : ''} ${application.basicInfo.lastName}`}
								/>
							</InfoCardRow>
							<InfoCardRow style={infoCardStyle}>
								<LabelValuePair
									labelStyle={labelStyle}
									containerStyle={{ marginRight: '0px' }}
									label='Email Address'
									value={application.basicInfo.email}
								/>
							</InfoCardRow>
							<InfoCardRow style={infoCardStyle}>
								<LabelValuePair
									labelStyle={labelStyle}
									containerStyle={{ marginRight: '0px' }}
									label='Phone'
									value={application.basicInfo.phone}
								/>
								<LabelValuePair
									labelStyle={labelStyle}
									containerStyle={{ marginRight: '0px' }}
									label='Business Phone'
									value={application.basicInfo.businessPhone}
								/>
							</InfoCardRow>
							<InfoCardRow style={infoCardStyle}>
								<LabelValuePair
									labelStyle={labelStyle}
									containerStyle={{ width: '100%', maxWidth: '320px' }}
									label='Highest Level of Education'
									value={application.basicInfo.highestLevelEducation}
								/>
								<LabelValuePair
									labelStyle={labelStyle}
									containerStyle={{ marginRight: '0px' }}
									label='US Citizen'
									value={getIsUsCitizenDisplayValue(
										application.basicInfo.isUsCitizen
									)}
								/>
							</InfoCardRow>
						</InfoCard>
					</div>
					<Address
						style={{ padding: '2px' }}
						containerStyle={{ marginRight: '0px' }}
						labelStyle={labelStyle}
						address={application.address} 
					/>
				</div>
				{(application.focusArea.length !== 0) ? (
					<InfoCard
						title='Focus Areas'
						style={{
							backgroundColor: 'white',
							minHeight: '60px',
						}}
					>
						{application.focusArea
							? application.focusArea
								.map((area, index) => {
									return (
										<InfoCardRow key={index} style={{ paddingBottom: '5px' }}>
											<LabelValuePair
												labelStyle={labelStyle}
												value={area}
											/>
										</InfoCardRow>
									);
								})
							: ''}
					</InfoCard>
				) : null}
				<InfoCard
					referenceInfoCardContentStyle={referenceInfoCardContentStyle}
					title='References'
					additionalText={`Reference Status: ${application.references.filter(ref => ref.referenceReceived === 'Yes').length} of ${application.references.length}`} >
					{application.references.map((reference, index) => {
						return (
							<div key={index} >
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div>
										<InfoCardRow style={infoCardStyle}>
											<h4>Reference {index + 1}</h4>
										</InfoCardRow>
									</div>
									{maxApplicantReferenceRequests &&
										<div>
											<Button
												type='primary'
												ghost
												disabled={reference.referenceReceived === 'Yes' ? true : false}
												style={{ marginLeft: '10px' }}
												onClick={() =>
													onCollectReferenceButtonClick(
														reference.refSysId,
														reference.referenceRequested
													)
												}
											>
												Request Reference
											</Button>
										</div>
									}

								</div>
								<InfoCardRow style={infoCardStyle}>
									<LabelValuePair
										labelStyle={labelStyle} 
										label='Name'
										value={`${reference.firstName} ${reference.middleName ? reference.middleName : ''} ${reference.lastName}`}
									/>
								</InfoCardRow>
								<InfoCardRow style={infoCardStyle}>
									<LabelValuePair
										labelStyle={labelStyle} 
										label='Email Address'
										value={reference.email}
									/>
								</InfoCardRow>
								<InfoCardRow style={infoCardStyle}>
									<LabelValuePair
										labelStyle={labelStyle}
										label='Phone Number'
										value={reference.phone}
									/>
									<LabelValuePair
										labelStyle={labelStyle}
										label='Relationship'
										value={reference.relationship}
									/>
									<LabelValuePair
										labelStyle={labelStyle}
										label='Position Title'
										value={reference.positionTitle}
									/>
								</InfoCardRow>
								<InfoCardRow style={infoCardStyle}>
									<LabelValuePair
										labelStyle={labelStyle}
										label='Reference Received'
										valueStyle={{ fontWeight: 'bold', color: reference.referenceReceived === 'Yes' ? 'green' : 'red' }}
										value={reference.referenceReceived}
									/>
								</InfoCardRow>
								{reference.contactAllowed ? (
									<InfoCardRow style={infoCardStyle}>
										<LabelValuePair
											labelStyle={labelStyle}
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
				<ReferenceModal
					refSysId={refSysId}
					referenceModal={referenceModal}
					setReferenceModal={setReferenceModal}
					requestReference={requestReference}
					referencesRequested={referencesRequested}
					maxTries={maxApplicantReferenceRequests}
					reloadApplicationInfo={reloadApplicationInfo}
				/>
			</div>
		</>
	);
};

export default applicantApplicationView;
