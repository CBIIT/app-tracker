import '../../CreateVacancy/Forms/FinalizeVacancy/FinalizeVacancy.css';
import FinalizeVacancy from '../../CreateVacancy/Forms/FinalizeVacancy/FinalizeVacancy.js';
import './ViewVacancyDashboard.css';

const viewVacancyDetails = (props) => {
	const allForms = props.allForms;
	const hideCommitteeSection = props.hideCommitteeSection;
	const hideEmails = props.hideEmails;

	return (
		<>
			<FinalizeVacancy
				allForms={allForms}
				hideCommitteeSection={hideCommitteeSection}
				hideEmails={hideEmails}
				showButton='false'
				sectionContentStyle={{ backgroundColor: 'white', border: 'none' }}
			/>
		</>
	);
};

export default viewVacancyDetails;
