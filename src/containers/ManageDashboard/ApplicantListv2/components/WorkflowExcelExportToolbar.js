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
					<Button
						type='primary'
						ghost
						disabled={!canExport || excelExport?.loading}
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
				{/* <Tooltip
					title={
						excelExport?.loading
							? 'Loading applicant data, please wait... Note: This may take a moment for larger applicant pools.'
							: rows.length === 0
								? 'No applicant data available for export.'
								: 'Export the current applicant list to Excel.'
					}
				>
					<Button
						type='primary'
						ghost
						disabled={!canExport || excelExport?.loading}
						onClick={() => {
							// This is the only place that should trigger the file download
							ExportToExcel(
								rows,
								`${filenamePrefix || 'ApplicantList'}-${excelExport?.workflowState || 'triage'}.xlsx`
							);
						}}
					>
						Export to Excel
					</Button>
				</Tooltip> */}
			</div>
		</>
	);
};

export default WorkflowExcelExportToolbar;
