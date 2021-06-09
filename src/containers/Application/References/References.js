import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import FileUploadAndDisplay from '../../../components/UI/FileUploadAndDisplay/FileUploadAndDisplay';
import {
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
} from '../../../constants/ApiEndpoints';

const referenceTable = 'x_g_nci_app_tracke_reference';

const references = (props) => (
	<div style={props.style}>
		<InfoCard
			title='References'
			onSwitchToggle={props.handleToggle}
			switchTitle='Display to committee members?'
			switchInitialValue={props.switchInitialValue}
		>
			<ul className='ApplicantDocumentList'>
				{props.references.map((reference, index) => (
					<li key={index}>
						<div className='LineItemItem'>{reference.name}</div>
						<div className='LineItemItem'>
							{props.allowUploadOrDelete ? (
								<FileUploadAndDisplay
									buttonText='Upload'
									sysId={reference.document.referenceSysId}
									url={SERVICE_NOW_FILE_ATTACHMENT}
									table={referenceTable}
									afterUploadSuccess={props.afterUploadOrDelete}
									downloadLink={reference.document.downloadLink}
									fileName={reference.document.filename}
									deleteUrl={
										SERVICE_NOW_ATTACHMENT + reference.document.attachmentSysId
									}
									onDeleteSuccess={props.afterUploadOrDelete}
									deleteConfirmTitle='Delete the attached reference document?'
									deleteConfirmText='This action cannot be undone, but you will be able to upload a new document afterwards.'
									uploadSuccessMessage={'Document uploaded.'}
									deleteSuccessMessage={'Document deleted.'}
								/>
							) : (
								<a href={reference.document.downloadLink}>
									{reference.document.filename}
								</a>
							)}
						</div>
					</li>
				))}
			</ul>
		</InfoCard>
	</div>
);

export default references;
