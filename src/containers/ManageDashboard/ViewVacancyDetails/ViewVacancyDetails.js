import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../CreateVacancy/Forms/FinalizeVacancy/FinalizeVacancy.css';
import FinalizeVacancy from '../../CreateVacancy/Forms/FinalizeVacancy/FinalizeVacancy.js';
import { transformJsonFromBackend } from '../Util/TransformJsonFromBackend.js';
import './ViewVacancyDashboard.css';
import axios from 'axios';

const viewVacancyDetails = () => {
	const { sysId } = useParams();
	const [allForms, setAllForms] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const response = await axios.get(
				'/api/x_g_nci_app_tracke/vacancy/get_vacancy_manager_view/' + sysId
			);
			const application = transformJsonFromBackend(response.data.result);

			setAllForms(application);
			setIsLoading(false);
		})();
	}, []);

	return isLoading ? (
		<> </>
	) : (
		<>
			<FinalizeVacancy allForms={allForms} showButton='false' />
		</>
	);
};

export default viewVacancyDetails;
