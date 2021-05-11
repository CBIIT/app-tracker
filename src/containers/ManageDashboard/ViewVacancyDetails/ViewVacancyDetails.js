import '../../CreateVacancy/Forms/FinalizeVacancy/FinalizeVacancy.css';
import FinalizeVacancy from '../../CreateVacancy/Forms/FinalizeVacancy/FinalizeVacancy.js';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './ViewVacancyDashboard.css';

const viewVacancyDetails = (props) => {
	const allForms = props.allForms;

	return (
		<>
			<FinalizeVacancy
				allForms={allForms}
				showButton='false'
				sectionContentStyle={{ backgroundColor: 'white', border: 'none' }}
			/>
			<div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
				<h2>Rating Plan</h2>
				<Upload {...props}>
					<Button icon={<UploadOutlined />}>Upload Rating Plan</Button>
				</Upload>
			</div>
		</>
	);
};

export default viewVacancyDetails;
