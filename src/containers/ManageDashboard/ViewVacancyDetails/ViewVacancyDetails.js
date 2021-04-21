import '../../CreateVacancy/Forms/FinalizeVacancy/FinalizeVacancy.css';
import FinalizeVacancy from '../../CreateVacancy/Forms/FinalizeVacancy/FinalizeVacancy.js';
import './ViewVacancyDashboard.css';

const viewVacancyDetails = (props) => {
	const allForms = props.allForms;

	return (
		<>
			<FinalizeVacancy allForms={allForms} showButton='false' />
		</>
	);
};

export default viewVacancyDetails;
