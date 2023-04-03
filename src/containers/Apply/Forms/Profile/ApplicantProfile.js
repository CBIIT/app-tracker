import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Avatar, Card, message } from 'antd';

import Loading from '../../../../components/Loading/Loading';
import { GET_PROFILE } from '../../../../constants/ApiEndpoints';

const ApplicantProfile = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [profile, setProfile] = useState({ basicInfo: {} });
	const { sysId } = useParams();

	useEffect(() => {
		(async () => {
			await getProfileInfo();
		})();
	}, []);

	const getProfileInfo = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(GET_PROFILE + sysId);
			console.log(response.data);
			/*
			setProfile(response.data.result);
			setIsLoading(false);
			*/
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
			<h1>Hello World!</h1>
		</>
	);
};

export default ApplicantProfile;
