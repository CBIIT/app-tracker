import { useEffect, useState, useContext } from 'react';
import { message, Button, Radio } from 'antd';
import { useParams } from 'react-router-dom';
import { useSplitApplicantTables } from './hooks/useSplitApplicantTables';
import SplitApplicantTables from './tables/SplitApplicantTables';
import ReferenceModal from './modals/ReferenceModal';
import RejectionEmailModal from './modals/RejectionEmailModal';
import SearchContext from '../Util/SearchContext';
import { isSplitTableMode } from './utils/ApplicantFilters';
import ExportToExcel from '../Util/ExportToExcel';
import axios from 'axios';
import {
	INDIVIDUAL_SCORING_IN_PROGRESS,
	INDIVIDUAL_SCORING_COMPLETE,
	INTERVIEW_COMPLETED,
	ROLLING_CLOSE,
} from '../../../constants/VacancyStates';
import {
	OWM_TEAM,
	COMMITTEE_MEMBER,
	COMMITTEE_CHAIR,
} from '../../../constants/Roles';
import {
	COLLECT_REFERENCES,
	SEND_REGRET_EMAIL,
} from '../../../constants/ApiEndpoints';
import './ApplicantListv2.css';

const ApplicantListv2 = (props) => {
	const { sysId } = useParams();

	const { userRoles = [] } = useContext(SearchContext);
	const isSplitMode = isSplitTableMode(userRoles, props.vacancyState, null);

	const {
		query,
		recommendedApplicants,
		nonRecommendedApplicants,
		recommendedTotalCount,
		nonRecommendedTotalCount,
		recommendedLoading,
		nonRecommendedLoading,
		handleTableChange,
		refresh,
	} = useSplitApplicantTables({ sysId, vacancyState: props.vacancyState });

	const [referenceModalOpen, setReferenceModalOpen] = useState(false);
	const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
	const [selectedAppSysId, setSelectedAppSysId] = useState(null);
	const [selectedReferenceStatus, setSelectedReferenceStatus] = useState(null);

	const onCollectionReferencesClick = (appSysId, referencesSent) => {
		setSelectedAppSysId(sysId);
		setSelectedReferenceStatus(referencesSent);
		setReferenceModalOpen(true);
	};

	const sendReferences = async (sysId) => {
		try {
			const referenceResponse = await axios.get(COLLECT_REFERENCES + sysId);
			message.success(referenceResponse.data.result.message);
			setReferenceModalOpen(false);
			refresh();
		} catch (error) {
			message.error(
				'Sorry, there was an error sending the notifications to the references. Try refreshing the browser.'
			);
		}
	};

	const sendRejectionEmail = async (sysId) => {
		try {
			const rejectionResponse = await axios.get(SEND_REGRET_EMAIL + sysId);
			message.success(rejectionResponse.data.result.response.message);
			setRejectionModalOpen(false);
			refresh();
		} catch (error) {
			message.error(
				'Sorry, there was an error sending the rejection email. Try refreshing the browser.'
			);
		}
	};

	return (
		<div className='applicant-list-v2'>
			<div className='header'>
				<h2>Applicants</h2>
				<ExportToExcel
					data={
						isSplitMode
							? [...recommendedApplicants, ...nonRecommendedApplicants]
							: applicants
					}
				/>
			</div>

			<div className='tables-container'>
				{isSplitMode ? (
					<SplitApplicantTables
						recommendedApplicants={recommendedApplicants}
						nonRecommendedApplicants={nonRecommendedApplicants}
						recommendedTotalCount={recommendedTotalCount}
						nonRecommendedTotalCount={nonRecommendedTotalCount}
						recommendedLoading={recommendedLoading}
						nonRecommendedLoading={nonRecommendedLoading}
						pageSize={query.pageSize}
						onTableChange={handleTableChange}
						onCollectionReferencesClick={onCollectionReferencesClick}
						userRoles={userRoles}
					/>
				) : (
					<div>Single Table</div>
				)}
			</div>

			<ReferenceModal
				open={referenceModalOpen}
				appSysId={selectedAppSysId}
				onClose={() => setReferenceModalOpen(false)}
				onSend={sendReferences}
			/>
			<RejectionEmailModal
				open={rejectionModalOpen}
				appSysId={selectedAppSysId}
				onClose={() => setRejectionModalOpen(false)}
				onSend={sendRejectionEmail}
			/>
		</div>
	);
};

export default ApplicantListv2;
