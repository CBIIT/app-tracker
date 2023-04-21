import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Divider, message, Space } from 'antd';

import ProfileContext, { initialData } from './Util/FormContext';
import Loading from '../../components/Loading/Loading';
import { GET_PROFILE } from '../../constants/ApiEndpoints';
import { convertDataFromBackend } from './Util/ConvertDataFromBackend';
import ApplicantCard from './Forms/ApplicantCard';
import EditableBasicInfo from '../EditableBasicInfo/EditableBasicInfo';
import DemographicsForm from './Forms/Demographics';

const ApplicantProfile = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [profile, setProfile] = useState(initialData);
	const [currentProfileInstance, setCurrentProfileInstance] = useState(null);
	const [hasProfile, setHasProfile] = useState(false);
	const { sysId } = useParams();

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
			console.log("🚀 ~ file: ApplicantProfile.js:37 ~ getProfileInfo ~ response:", response.data.result);
			if (response.data.result.status !== 400) {
				setProfile(convertDataFromBackend(response.data.result.response));
				console.log("🚀 ~ file: ApplicantProfile.js:40 ~ getProfileInfo ~ profile:", profile);
				setHasProfile(true);
			}
			setIsLoading(false);
		} catch (e) {
			message.error(
				'Sorry! There was an error loading your profile. Try refreshing the browser.'
			);
		}
	};

	return isLoading ? (
		<Loading />
	) : hasProfile ? (
		<ProfileContext.Provider value={profileContext}>
			<ApplicantCard />
		</ProfileContext.Provider>
	) : (
		<div style={{ marginLeft: 35, marginRight: 35, paddingTop: 40 }}>
			<ProfileContext.Provider value={profileContext}>
				<Space size={25} direction='vertical'>
					<EditableBasicInfo />
					<Divider />
					<DemographicsForm />
				</Space>
			</ProfileContext.Provider>
		</div>
	);
};

export default ApplicantProfile;