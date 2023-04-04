import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Avatar, Card, message, Typography, Divider } from 'antd';
const { Paragraph, Title } = Typography;

import InfoCard from '../../../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../../../components/UI/InfoCard/InfoCardRow/InfoCardRow';
import LabelValuePair from '../../../../components/UI/LabelValuePair/LabelValuePair';
import Loading from '../../../../components/Loading/Loading';
import { GET_PROFILE } from '../../../../constants/ApiEndpoints';

const ApplicantProfile = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [profile, setProfile] = useState({});
	const { sysId } = useParams();

	useEffect(() => {
		(async () => {
			await getProfileInfo();
		})();
	}, []);

	const getUsCitizenshipValue = (value) => {
		switch (value) {
			case '1':
				return 'Yes';
			case '0':
				return 'No';
			default:
				return '';
		}
	};

	const getFirstInitial = (first) => {
		const firstName = first.split('');
		console.log(
			'🚀 ~ file: ApplicantProfile.js:36 ~ getFirstInitial ~ profile:',
			profile
		);
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
			setProfile(response.data.result.response);
			setIsLoading(false);
		} catch (e) {
			message.error(
				'Sorry! There was an error loading your profile. Try refreshing the browser.'
			);
		}
	};

	return isLoading ? (
		<Loading />
	) : (
		<>
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
							{getFirstInitial(profile.first_name) +
								getLastInitial(profile.last_name)}
						</Avatar>
						<Title
							level={4}
							style={{
								marginLeft: '10px',
								marginTop: '10px',
								color: '#2b2b2b',
							}}
						>
							{profile.first_name} {profile.last_name}
						</Title>
					</div>
				}
			>
				<div style={{marginBottom: '25px'}}>
					<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
						Address
					</Title>
					<Paragraph style={{ color: '#363636' }}>
						{profile.address_2
							? profile.address + ' ' + profile.address_2
							: profile.address}
						<br />
						{`${profile.city}, ${profile.state_province} ${profile.zip_code}`}
						<br />
						{profile.country}
					</Paragraph>
				</div>
				<div style={{marginBottom: '25px'}}>
					<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
						Email
					</Title>
					<Paragraph style={{ color: '#363636' }}>
						{profile.email}
					</Paragraph>
				</div>
				<div style={{marginBottom: '25px'}}>
					<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
						Mobile
					</Title>
					<Paragraph style={{ color: '#363636' }}>
						{profile.phone}
					</Paragraph>
				</div>
			</Card>
		</>
	);
};

export default ApplicantProfile;
