import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CHECK_AUTH } from '../../constants/ApiEndpoints';
import CreateVacancy from './CreateVacancy';
import { FINAL, LIVE } from '../../constants/VacancyStates';
import { GET_VACANCY_MANAGER_VIEW } from '../../constants/ApiEndpoints';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend';

const editVacancy = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState();
	const [readOnlyMember, setReadOnlyMember] = useState(false);
	const { sysId } = useParams();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setIsLoading(true);
		const response = await axios.get(GET_VACANCY_MANAGER_VIEW + sysId);
		const readOnlyCheck = await axios.get(CHECK_AUTH);
		const readOnlyResponse = readOnlyCheck.data.result.user.user_id;
		const newData = transformJsonFromBackend(response.data.result);
		setData(newData);
		checkForReadOnlyMember(newData.vacancyCommittee, readOnlyResponse);
		setIsLoading(false);
	};

	const checkForReadOnlyMember = (userArray, currentUser) => {
		// check for current user
		for (let i = 0; i < userArray.length; i++) {
			console.log(userArray[i].role)
			if (userArray[i].user.sys_id.value === currentUser && userArray[i].role == "Member Voting (read-only)") {
				setReadOnlyMember(true);
			}
		}
	}

	return isLoading ? (
		<></>
	) : (
		<CreateVacancy
			initialValues={data}
			readOnlyMember = {readOnlyMember}
			sysId={data.sysId}
			editFinalizedVacancy={true}
			restrictedEditMode={data.state !== LIVE && data.state !== FINAL}
		/>
	);
};

export default editVacancy;
