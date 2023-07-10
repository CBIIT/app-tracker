import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { message, Button } from 'antd';
import { useReactToPrint } from 'react-to-print';

import InfoCard from '../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../components/UI/InfoCard/InfoCardRow/InfoCardRow';
import LabelValuePair from '../../components/UI/LabelValuePair/LabelValuePair';
import Loading from '../../components/Loading/Loading';
import Address from '../Application/Address/Address';
import { APPLICANT_GET_APPLICATION, GET_PROFILE } from '../../constants/ApiEndpoints';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend';
import { convertDataFromBackend } from '../Profile/Util/ConvertDataFromBackend';

import './ApplicantApplicationView.css';

const applicantApplicationView = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [application, setApplication] = useState({ basicInfo: {} });
	const [demographics, setDemographics] = useState({});
	const { appSysId } = useParams();
	const applicationRef = useRef();

	const {auth: {user}} = useAuth();

	const handlePrint = useReactToPrint({
		documentTitle: `${application.basicInfo.firstName} ${application.basicInfo.lastName} application`,
		content: () => applicationRef.current,
	});

	useEffect(() => {
		(async () => {
			await getApplicationInfo();
		})();
		(async () => {
			await getProfileInfo();
		})();

	}, []);

	const getProfileInfo = async () => {
		try {
			const profileResponse = await axios.get( GET_PROFILE + user.uid );
			const profileData = convertDataFromBackend(profileResponse.data.result.response)
			const {demographics} = profileData;
			setDemographics(demographics);
		} catch (error) {
			message.error(
				'Sorry, there was an error loading the profile demographics.  Try refreshing the browser.'
			);
		}
	};

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

	const getAllRaces = (value) => {
		if (!value)
			return '';
		for(var i = 0; i < value.length; i++)
			value[i] = getRace(value[i]);
		return value.join(', ');
	}

	const getAllDisabilities = (value) => {
		if (!value)
			return '';
		for(var i = 0; i < value.length; i++)
			value[i] = getDisability(value[i]);
		return value.join(', ');
	}

	const getRace = (value) => {
        switch (value) {
            case 'American Indian':
                return "American Indian or Alaska Native";
            case 'Asian':
                return 'Asian';
            case 'African-American':
                return "Black or African-American";
            case 'Pacific Islander':
                return "Native Hawaiian or other Pacific Islander"
            case 'White':
                return 'White';
        }
    }

	const getEthnicity = (value) => {
		switch (value) {
			case '1':
				return 'Hispanic or Latino';
			case '0':
				return 'Not Hispanic or Latino';
			default:
				return '';
		}
	};

    const getDisability = (value) => {
		switch (value) {
			case 'Deaf':
				return 'Deaf or serious difficulty hearing';
			case 'Blind':
				return 'Blind or serious difficulty seeing even when wearing glasses';
			case 'Amputee':
				return 'Missing an arm, leg, hand or foot';
			case 'Paralysis':
				return 'Paralysis: partial or complete paralysis (any cause)';
			case 'Disfigurement':
				return 'Significant disfigurement: for example, severe disfigurements caused by burns, wounds, accidents or congenital disorders';
			case 'Mobility Impairment':
				return 'Significant mobility impairment: for example, uses a wheelchair, scooter, walker or uses a leg brace to walk';
			case 'Psychiatric Disorder':
				return 'Significant psychiatric disorder: for example, bipolar disorder, schizophrenia, PTSD or major depression';
			case 'Intellectual Disability':
				return 'Intellectual disability (formerly described as mental retardation)';
			case 'Developmental Disability':
				return 'Developmental disability: for example, cerebral palsy or autism spectrum disorder';
			case 'Brain Injury':
				return 'Traumatic brain injury';
			case 'Dwarfism':
				return 'Dwarfism';
			case 'Epilepsy':
				return 'Epilepsy';
			case 'Other Disability':
				return 'Other disability or serious health condition: for example, diabetes, cancer, cardiovascular disease, anxiety disorder or HIV infection';
			case 'None':
				return 'None of the conditions listed above apply to me.';
			case 'Do Not Wish to Answer':
				return 'I do not wish to answer questions regarding my disability/health conditions.';
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
				{(application.focusArea) ?
					<InfoCard title='Focus Areas'
						style={{
							backgroundColor: 'white',
							minHeight: '60px',
						}}
					>
						{(application.focusArea) ? application.focusArea?.map((area, index) => {
							return (
								<InfoCardRow key={index}
									style={{ paddingBottom: '5px'}}
									>
									<LabelValuePair value={area} style={{ marginBottom: '5px'}}/>
								</InfoCardRow>
							);
						}) : null}
					</InfoCard>
					:
					null
				}
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
				<InfoCard title='Demographics'>
					<InfoCardRow>
						<div className='SectionContentRow'>
							<LabelValuePair
								label='Sharing demographics'
								//value={profile}
								value={demographics?.share != "0" ? "Yes" : "No" }
							/>
							<LabelValuePair
								label='Sex'
								value={ demographics?.sex ? demographics?.sex : "Prefer not to answer"}
							/>
							<LabelValuePair
								label='Ethnicity'
								value={demographics?.ethnicity ? getEthnicity(demographics?.ethnicity) : "Prefer not to answer"}
							/>
							<LabelValuePair
								label='Race'
								value={getAllRaces(demographics?.race)}
							/>
							<LabelValuePair
								label='Disability'
								value={getAllDisabilities(demographics?.disability)}
							/>
						</div>
					</InfoCardRow>
				</InfoCard>
			</div>
		</>
	);
};

export default applicantApplicationView;
