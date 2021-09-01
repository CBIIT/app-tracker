import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import FileUploadAndDisplay from '../../../components/UI/FileUploadAndDisplay/FileUploadAndDisplay';
import {
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
} from '../../../constants/ApiEndpoints';

import './References.css';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const referenceTable = 'x_g_nci_app_tracke_reference';

const references = (props) => {
	const references = props.references;

	return (
		<InfoCard
			className='infoCardTitle'
			title='References'
			onSwitchToggle={props.handleToggle}
			switchTitle='Display to committee members?'
			switchInitialValue={props.switchInitialValue}
		>
			{references.map((reference, index) => {
				return (
					<div style={props.style} key={index}>
						<Collapse className='referenceCard'>
							<Panel
								className='referencePanel'
								header={reference.name !== null ? reference.name : ''}
							>
								<ul className='ApplicantDocumentList'>
									<li>
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
														SERVICE_NOW_ATTACHMENT +
														reference.document.attachmentSysId
													}
													onDeleteSuccess={props.afterUploadOrDelete}
													deleteConfirmTitle='Delete the attached reference document?'
													deleteConfirmText='This action cannot be undone, but you will be able to upload a new document afterwards.'
													uploadSuccessMessage={'Document uploaded.'}
													deleteSuccessMessage={'Document deleted.'}
													key={index}
												/>
											) : (
												<a href={reference.document.downloadLink}>
													{reference.document.filename}
												</a>
											)}
										</div>
									</li>
									<li>
										<div className='LineItemItem'>Email: {reference.email}</div>
										<div className='LineItemItem'>Phone: {reference.phone}</div>
									</li>
									<li>
										<div className='LineItemItem'>
											Relationship: {reference.relationship}
										</div>
										<div className='LineItemItem'>Title: {reference.title}</div>
									</li>
									<li>
										<div className='LineItemItem'>
											Organization: {reference.organization}
										</div>
										<div className='LineItemItem'>
											Contact Allowed: {reference.contact_allowed}
										</div>
									</li>
								</ul>
							</Panel>
						</Collapse>
					</div>
				);
			})}
		</InfoCard>
	);
};

export default references;
