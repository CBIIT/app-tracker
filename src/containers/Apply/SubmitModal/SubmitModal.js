import { useState } from 'react';
import axios from 'axios';
import { Modal, message, notification } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { transformJsonToBackend } from '../Util/TransformJsonToBackend';
import './SubmitModal.css';
import {
	SUBMIT_APPLICATION,
	APPLICATION_SUBMISSION,
	ATTACHMENT_CHECK,
	ATTACHMENT_CHECK_FOR_APPLICATIONS,
} from '../../../constants/ApiEndpoints';
import { VIEW_APPLICATION } from '../../../constants/Routes';
import useAuth from '../../../hooks/useAuth';
import { checkAuth } from '../../../constants/checkAuth';

const submitModal = ({
	data,
	draftId,
	visible,
	onCancel,
	editSubmitted,
	submittedAppSysId,
}) => {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [appSysId, setAppSysId] = useState();
	const [submitted, setSubmitted] = useState(false);

	const history = useHistory();

	const { setAuth } = useAuth();

	const handleOk = async () => {

		setConfirmLoading(true);

		try {
			const dataToSend = transformJsonToBackend(data);

			if (editSubmitted) {
				dataToSend['app_sys_id'] = submittedAppSysId;
				
				const requests = [];
				
				// TODO: check mandatory documents
				const checkMandatoryDocuments = await axios.get(ATTACHMENT_CHECK_FOR_APPLICATIONS + submittedAppSysId);
				const mandatoryDocuments = checkMandatoryDocuments.data.result.messages;

				const checkAttachments = () => {
					// Filters out optional documents
					const filterOutOptional = mandatoryDocuments.filter((doc) => doc.is_optional == 'false');

					// Filters out the documents that return exists as false
					const filterByFalse = filterOutOptional.filter((doc) => doc.exists == false);
					
					// If the length of the filterByFalse is greater than 0, return false, else return true
					if (filterByFalse.length > 0) {
						return false;
					} else {
						return true;
					}
				};

				if (checkAttachments() == true) {
					await axios.put(APPLICATION_SUBMISSION, dataToSend);
					setAppSysId(submittedAppSysId);
					await Promise.all(requests);
				} else {
					setSubmitted(false);
					notification.error({
						message:'Sorry! There was an error with submitting the attachments.',
						description:(
							<>
								<p>
									Please re-upload the attachment(s) and try again. If the issue
									continues, contact the Help Desk by emailing{' '}
									<a href='mailto:NCIAppSupport@mail.nih.gov'>
										NCIAppSupport@mail.nih.gov
									</a>
								</p>
							</>
						),
						duration: 30,
						style: {
							height: '25vh',
							display: 'flex',
							alignItems: 'center',
						},
					});
					history.goBack();
				}

			} else {
				if (draftId) {
					dataToSend['draft_id'] = draftId;
				};

				const requests = [];

				const appDocResponse = await axios.get(ATTACHMENT_CHECK + draftId);
				console.log('appDocResponse : ', appDocResponse);
				const documents = appDocResponse.data.result.messages;
				console.log("🚀 ~ handleOk ~ documents:", documents);

				const checkAttachments = () => {
					// Filters out optional documents
					const filterOutOptional = documents.filter((doc) => doc.is_optional == 'false');

					// Filters out the documents that return exists as false
					const filterByFalse = filterOutOptional.filter((doc) => doc.exists == false);
					
					// If the length of the filterByFalse is greater than 0, return false, else return true
					if (filterByFalse.length > 0) {
						return false;
					} else {
						return true;
					}
				};

				if (checkAttachments() == true) {
					const response = await axios.post(SUBMIT_APPLICATION, dataToSend);
					setAppSysId(response.data.result.application_sys_id);
					await Promise.all(requests);
				} else {
					setSubmitted(false);
					notification.error({
						message:'Sorry! There was an error with submitting the attachments.',
						description:(
							<>
								<p>
									Please re-upload the attachment(s) and try again. If the issue
									continues, contact the Help Desk by emailing{' '}
									<a href='mailto:NCIAppSupport@mail.nih.gov'>
										NCIAppSupport@mail.nih.gov
									</a>
								</p>
							</>
						),
						duration: 30,
						style: {
							height: '25vh',
							display: 'flex',
							alignItems: 'center',
						},
					});
					history.goBack();
				}
			}

			setSubmitted(true);

		} catch (error) {
			console.log(error)
			message.error(
				'Sorry!  There was an error when attempting to submit your application or it is past the close date.'
			);
		} finally {
			setSubmitted(true);
			setConfirmLoading(false);
			checkAuth(setConfirmLoading, setAuth);
		}

	};

	const handleClose = () => {
		history.push('/');
	};

	return !submitted ? (
		<Modal
			visible={visible}
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={onCancel}
			closable={false}
			okText='Ok'
			cancelText='Cancel'
		>
			<div className='ConfirmSubmitModal'>
				<ExclamationCircleFilled
					style={{ color: '#faad14', fontSize: '24px' }}
				/>
				<h2>Ready to submit application?</h2>
				<p>Please ensure that the correct documents have been submitted.</p>
				<p>
					Once the application is submitted, and the close date has been
					reached, it cannot be edited.
				</p>
			</div>
		</Modal>
	) : (
		<Modal
			visible={visible}
			onOk={handleClose}
			okButtonProps={{ ghost: true }}
			confirmLoading={confirmLoading}
			cancelButtonProps={{ style: { display: 'none' } }}
			onCancel={onCancel}
			closable={false}
			className='ModalConfirmed'
			okText='Done'
		>
			<div className='Confirmed'>
				<CheckCircleFilled className='ConfirmedIcon' />
				<h2>Application Submitted</h2>
				<p>
					View and print <Link to={VIEW_APPLICATION + appSysId}>here</Link>.
				</p>
			</div>
		</Modal>
	);
};

export default submitModal;
