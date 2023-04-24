import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { message, Avatar, Card, Typography } from 'antd';
const { Title } = Typography;

import ProfileContext, { initialData } from './Util/FormContext';
import Loading from '../../components/Loading/Loading';
import { GET_PROFILE } from '../../constants/ApiEndpoints';
import { convertDataFromBackend } from './Util/ConvertDataFromBackend';
import BasicInfoTab from './ApplicantCard/Tabs/BasicInfoTab';
import DemographicTab from './ApplicantCard/Tabs/DemographicTab';

const tabList = [
	{
		key: 'basicInfo',
		tab: 'Basic Information',
	},
	{
		key: 'demographics',
		tab: 'Demographics',
	},
];

const ApplicantProfile = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [profile, setProfile] = useState(initialData);
	const [currentProfileInstance, setCurrentProfileInstance] = useState(null);
	const [hasProfile, setHasProfile] = useState(false);
	const [activeTab, setActiveTab] = useState('basicInfo');
	const { sysId } = useParams();

	const contentObject = {
		basicInfo: <BasicInfoTab hasProfile={hasProfile} />,
		demographics: <DemographicTab hasProfile={hasProfile}/>,
	};

	const profileContext = {
		profile,
		setProfile,
		currentProfileInstance,
		setCurrentProfileInstance,
	};

	useEffect(() => {
		(async () => {
			await getProfileInfo();
		})();
	}, []);

	const getProfileInfo = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(GET_PROFILE + sysId);
			console.log(
				'🚀 ~ file: ApplicantProfile.js:37 ~ getProfileInfo ~ response:',
				response.data.result
			);
			if (response.data.result.status !== 400) {
				setProfile(convertDataFromBackend(response.data.result.response));
				console.log(
					'🚀 ~ file: ApplicantProfile.js:40 ~ getProfileInfo ~ profile:',
					profile
				);
				setHasProfile(true);
			}
			setIsLoading(false);
		} catch (e) {
			message.error(
				'Sorry! There was an error loading your profile. Try refreshing the browser.'
			);
		}
	};

	const getFirstInitial = (first) => {
		const firstName = first.split('');
		return firstName[0];
	};

	const getLastInitial = (last) => {
		const lastName = last.split('');
		return lastName[0];
	};

	const tabChange = (key) => {
		setActiveTab(key);
	};

	const { basicInfo } = profile;

	return isLoading ? (
		<Loading />
	) : (
		<ProfileContext.Provider value={profileContext}>
			<Card
				style={{ width: '100%', height: '100%' }}
				tabList={tabList}
				activeTabKey={activeTab}
				onTabChange={tabChange}
				title={
					hasProfile ? (
						<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<Avatar
							size={50}
							style={{ backgroundColor: '#15477a', color: 'ffffff' }}
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
					) : (
						<></>
					)
				}
			>
				{contentObject[activeTab]}
			</Card>
		</ProfileContext.Provider>
	);
};

export default ApplicantProfile;
