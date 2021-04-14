import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import ReactQuill from 'react-quill';
import SectionHeader from '../../../components/UI/ReviewSectionHeader/ReviewSectionHeader';
import '../../CreateVacancy/Forms/FinalizeVacancy/FinalizeVacancy.css';
import FinalizeVacancy from '../../CreateVacancy/Forms/FinalizeVacancy/FinalizeVacancy.js';
import axios from 'axios';

const viewVacancyDetails = () => {
	const [vacancy, setVacancy] = useState([]);
	const { sysId } = useParams();
	const [statements, setStatements] = useState([]);
	const [showStatements, setShowStatements] = useState([]);
	const [basicInfo, setBasicInfo] = useState([]);

	useEffect(() => {
		(async () => {
			const response = await axios.get(
				'/api/x_g_nci_app_tracke/vacancy/get_vacancy_manager_view/' + sysId
			);
			console.log(
				'[View VACANCY]: ',
				response.data.result.basic_info.vacancy_title.label,
				response.data.result
			);
			setShowStatements(
				Object.entries(response.data.result.basic_info).filter((entry) =>
					entry[0].includes('show')
				)
			);
			setStatements(
				Object.entries(response.data.result.basic_info).filter((entry) =>
					entry[0].includes('statement')
				)
			);

			setVacancy(response.data.result);

			setBasicInfo(response.data.result.basic_info);
			console.log('[BASIC INFO]:', basicInfo);
		})();
	}, []);

	console.log(
		'[SHOW STATEMENTS]: ',
		showStatements.map((statement) => statement)
	);
	console.log('[STATEMENTS]', statements);
	let mandatoryStatements = {
		foreignEducation: '',
		standardsOfConduct: '',
		equalOpportunityEmployer: '',
		reasonableAccomodation: '',
	};

	let showEmails = [];
	showStatements.map((statement) => {
		if (statement[1].value == '1') {
			statement[1].value = true;
		} else {
			statement[1].value = false;
		}
		showEmails.push(statement[1].value);
	});
	console.log('[BOOLS]:', showEmails);

	return (
		// <FinalizeVacancy
		// 	basicInfo={basicInfo}
		// 	// mandatoryStatements={showEmails}
		// 	// vacancyCommittee={}
		// 	// emailTemplates={}
		// />
		null
	);
};

export default viewVacancyDetails;
