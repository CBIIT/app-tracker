import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import FileUploadAndDisplay from '../../../components/UI/FileUploadAndDisplay/FileUploadAndDisplay';
import {
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
} from '../../../constants/ApiEndpoints';

import './References.css';
import { Collapse, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Panel } = Collapse;

const referenceTable = 'x_g_nci_app_tracke_reference';

const uploadFile = async (
	{ file, onSuccess, onError },
	tableSysId,
	url,
	table,
	afterUploadSuccess,
	uploadSuccessMessage
) => {
	const options = {
		params: {
			file_name: file.name,
			table_name: table,
			table_sys_id: tableSysId,
		},
		headers: {
			'Content-Type': file.type,
		},
	};

	try {
		message.info('Uploading...', 0);
		await axios.post(url, file, options);
		onSuccess(null, file);
		afterUploadSuccess();
		message.destroy();
		message.success(uploadSuccessMessage);
	} catch (error) {
		message.destroy();
		message.error(
			'Sorry, an error occurred while uploading.  Try reloading the page and uploading again.'
		);
		onError(error);
	}
};

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
								<ul className='ReferenceDocumentList'>
									<li>
										<div className='LineItemItem'>{reference.name}</div>
										<div className='LineItemItem'>
											<ul>
												{reference.documents.map((document, index) => {
													return (
														<li key={index}>
															{props.allowUploadOrDelete ? (
																<FileUploadAndDisplay
																	buttonText='Upload'
																	sysId={document.referenceSysId}
																	url={SERVICE_NOW_FILE_ATTACHMENT}
																	table={referenceTable}
																	afterUploadSuccess={props.afterUploadOrDelete}
																	downloadLink={document.downloadLink}
																	fileName={document.filename}
																	deleteUrl={
																		SERVICE_NOW_ATTACHMENT +
																		document.attachmentSysId
																	}
																	onDeleteSuccess={props.afterUploadOrDelete}
																	deleteConfirmTitle='Delete the attached reference document?'
																	deleteConfirmText='This action cannot be undone, but you will be able to upload a new document afterwards.'
																	uploadSuccessMessage={'Document uploaded.'}
																	deleteSuccessMessage={'Document deleted.'}
																	key={index}
																/>
															) : (
																<a href={document.downloadLink}>
																	{document.filename}
																</a>
															)}
														</li>
													);
												})}
												<li>
													<Upload
														maxCount={1}
														showUploadList={false}
														customRequest={({
															file,
															onSuccess,
															onError,
															onProgress,
														}) =>
															uploadFile(
																{ file, onSuccess, onError, onProgress },
																reference.referenceSysId,
																SERVICE_NOW_FILE_ATTACHMENT,
																referenceTable,
																props.afterUploadOrDelete,
																'Document uploaded.'
															)
														}
													>
														<Button icon={<UploadOutlined />}>Upload</Button>
													</Upload>
												</li>
											</ul>
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
										{props.displayContactQuestion === true ? (
											<div className='LineItemItem'>
												Contact Allowed: {reference.contact_allowed}
											</div>
										) : null}
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
