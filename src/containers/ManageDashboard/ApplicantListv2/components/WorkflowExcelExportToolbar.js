import { Button, Tooltip } from 'antd';
import ExportToExcel from '../../Util/ExportToExcel/ExportToExcel';

const WorkflowExcelExportToolbar = ({ excelExport, filenamePrefix }) => {
	const rows = Array.isArray(excelExport?.rows) ? excelExport.rows : [];
	const canExport = rows.length > 0;

	return (
		<>
			<div className='export-toolbar'>
				{excelExport?.loading ? (
					<Tooltip 
						title={'Note: This may take a moment for larger applicant pools.'}
					>
					<Button
						type='primary'
						ghost
						disabled={!canExport || excelExport?.loading}
					>
						Loading applicant data, please wait...
					</Button>
					</Tooltip>
				) : (
					// May want to look into adding third scenario (No applicants to download)
					// May want to use this verbiage "No applicant data available for export."
					<Button
						type='primary'
						ghost
						onClick={() => {
							// This is the only place that should trigger the file download
							ExportToExcel(
								rows,
								`${filenamePrefix || 'ApplicantList'}-${excelExport?.workflowState || 'triage'}.xlsx`
							);
						}}
					>
						Export applicant data
					</Button>
				)}
			</div>
		</>
	);
};

export default WorkflowExcelExportToolbar;
