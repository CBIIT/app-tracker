import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Apply from './Apply';
import { GET_APPLICATION_DRAFT } from '../../constants/ApiEndpoints';

const editApplication = () => {
	const { draft, appSysId } = useParams();
	const [application, setApplication] = useState();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (draft) getDraftApplication();
	}, []);

	const getDraftApplication = async () => {
		setIsLoading(true);
		const response = await axios.get(GET_APPLICATION_DRAFT + appSysId);
		setApplication(JSON.parse(response.data.result.jsonobj.value));
		setIsLoading(false);
	};

	return !isLoading ? <Apply initialValues={application} /> : <></>;
};

export default editApplication;
