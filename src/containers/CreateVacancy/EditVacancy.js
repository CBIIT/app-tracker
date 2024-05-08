import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import CreateVacancy from './CreateVacancy';
import { FINAL, LIVE } from '../../constants/VacancyStates';
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
		const newData = transformJsonFromBackend(response.data.result);
		setData(newData);
		setIsLoading(false);
	};

	return isLoading ? (
		<></>
	) : (
		<CreateVacancy
			initialValues={data}
			sysId={data.sysId}
			editFinalizedVacancy={true}
			restrictedEditMode={data.status !== 'open' && (data.state !== LIVE && data.state !== FINAL)}
		/>
	);
};

export default editVacancy;
