import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import CreateVacancy from './CreateVacancy';
import { GET_VACANCY_MANAGER_VIEW } from '../../constants/ApiEndpoints';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend';

const editVacancy = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState();
	const { sysId } = useParams();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setIsLoading(true);
		const response = await axios.get(GET_VACANCY_MANAGER_VIEW + sysId);
		console.log('[Edit Vacancy] response: ', response);
		const newData = transformJsonFromBackend(response.data.result);
		setData(newData);
		setIsLoading(false);
	};

	return isLoading ? (
		<></>
	) : (
		<CreateVacancy initialValues={data} sysId={data.sysId} />
	);
};

export default editVacancy;
