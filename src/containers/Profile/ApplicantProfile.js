import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Avatar, Card, message, Typography, Divider } from 'antd';
const { Paragraph, Title } = Typography;

import ProfileContext, { initialData } from './Util/FormContext';
import Loading from '../../components/Loading/Loading';
import { GET_PROFILE } from '../../constants/ApiEndpoints';
import { convertDataFromBackend } from './Util/ConvertDataFromBackend';
import DemographicsForm from './Forms/Demographics';

const ApplicantProfile = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [profile, setProfile] = useState(initialData);
	const [currentProfileInstance, setCurrentProfileInstance] = useState(null);
	const { sysId } = useParams();

	const profileContext = {
		profile,
		currentProfileInstance,
		setCurrentProfileInstance,
	};

	useEffect(() => {
		(async () => {
			await getProfileInfo();
		})();
	}, []);

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

	const getFullNumber = (prefix, number) => {
		const areaCode = number.slice(0, 3);
		const firstHalf = number.slice(3, 6);
		const secondHalf = number.slice(6);
		return `${prefix} (${areaCode}) ${firstHalf} - ${secondHalf}`;
	};

	const getFirstInitial = (first) => {
		const firstName = first.split('');
		return firstName[0];
	};

	const getLastInitial = (last) => {
		const lastName = last.split('');
		return lastName[0];
	};

	const getProfileInfo = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(GET_PROFILE + sysId);
			setProfile(convertDataFromBackend(response.data.result.response));
			setIsLoading(false);
		} catch (e) {
			message.error(
				'Sorry! There was an error loading your profile. Try refreshing the browser.'
			);
		}
	};

	const { basicInfo, demographics, references } = profile;

	const address = basicInfo?.address;

	/*return (
		<>
			<h1>Hello World!</h1>
			{console.log(
				'🚀 ~ file: ApplicantProfile.js:67 ~ getProfileInfo ~ basicInfo:',
				basicInfo, address
			)}
		</>
	);*/

	return isLoading ? (
		<Loading />
	) : (
		<>
			<ProfileContext.Provider value={profileContext}>
				<Card
					style={{ width: '100%', height: '100%' }}
					title={
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Avatar
								size={50}
								style={{ backgroundColor: '#015ea2', color: 'ffffff' }}
							>
								{getFirstInitial(basicInfo.firstName) +
									getLastInitial(basicInfo.lastName)}
							</Avatar>
							<Title
								level={4}
								style={{
									marginLeft: '10px',
									marginTop: '10px',
									fontSize: '18px',
									color: '#2b2b2b',
								}}
							>
								{basicInfo.firstName} {basicInfo.lastName}
							</Title>
						</div>
					}
				>
					<div style={{marginLeft: '60px'}}>
						<div style={{ marginBottom: '25px' }}>
							<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
								Address
							</Title>
							<Paragraph style={{ color: '#363636' }}>
								{address.address2
									? address.address + ' ' + address.address2
									: address.address}
								<br />
								{`${address.city}, ${address.stateProvince} ${address.zip}`}
								<br />
								{address.country}
							</Paragraph>
						</div>
						<div style={{ marginBottom: '25px' }}>
							<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
								Email
							</Title>
							<Paragraph style={{ color: '#363636' }}>
								{basicInfo.email}
							</Paragraph>
						</div>
						<div style={{ marginBottom: '25px' }}>
							<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
								Mobile
							</Title>
							<Paragraph style={{ color: '#363636' }}>
								{getFullNumber(basicInfo.phonePrefix, basicInfo.phone)}
							</Paragraph>
						</div>
						<Divider />
						{open ? (
							<DemographicsForm demographics={demographics} />
						) : (
							<div>
								<Title
									level={4}
									style={{
										color: '#2b2b2b',
										fontSize: '18px',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									Demographics{' '}
									<span style={{ fontSize: '14px', marginLeft: '5px' }}>
										(optional)
									</span>
								</Title>
								<div>
									<a onClick={() => setOpen(true)}>Edit</a>
								</div>
								<div>
									<Title
										level={5}
										style={{ fontSize: '14px', color: '#6a6a6a' }}
									>
										Sex
									</Title>
									<Paragraph style={{ color: '#363636' }}>
										{demographics.sex}
									</Paragraph>
								</div>
								<div>
									<Title
										level={5}
										style={{ fontSize: '14px', color: '#6a6a6a' }}
									>
										{' '}
										Ethnicity{' '}
									</Title>
									<Paragraph style={{ color: '#363636' }}>
										{getEthnicity(demographics.ethnicity)}
									</Paragraph>
								</div>
								<div>
									<Title
										level={5}
										style={{ fontSize: '14px', color: '#6a6a6a' }}
									>
										{' '}
										Race{' '}
									</Title>
									<Paragraph style={{ color: '#363636' }}>
										{demographics.race}
									</Paragraph>
								</div>
								<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
									{' '}
									Disabilities/Serious Health Condition{' '}
								</Title>
								<Paragraph style={{ color: '#363636' }}>
									{demographics.disability}
								</Paragraph>
							</div>
						)}
					</div>
				</Card>
			</ProfileContext.Provider>
		</>
	);
};

export default ApplicantProfile;
// If edit button is clicked in a section, the form will render
// function to handle rendering components
