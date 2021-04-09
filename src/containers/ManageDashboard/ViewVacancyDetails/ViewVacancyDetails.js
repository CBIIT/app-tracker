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
			setStatements(
				Object.entries(response.data.result.basic_info).filter((entry) =>
					entry[0].includes('statement')
				)
			);
			debugger;
			setVacancy(response.data.result);
		})();
	}, []);

	debugger;
	console.log('[STATEMENTS]: ', statements);

	return (
		// <FinalizeVacancy basicInfo={vacancy.basic_info} mandatoryStatements={} />
		null
	);
};

export default viewVacancyDetails;
