import CandidateDidNotInterview from './CandidateDidNotInterview/CandidateDidNotInterview';
import CandidateDidInterview from './CandidateDidInterview/CandidateDidInterview';

const rejectionEmailModal = (props) => {
	const appSysId = props.appSysId;
    const referredToInterview = props.referredToInterview;
    const rejectionEmailModal = props.rejectionEmailModal;
	const rejectionEmailSent = props.rejectionEmailSent;
	const sendRejectionEmail = props.sendRejectionEmail;
	const setRejectionEmailModal = props.setRejectionEmailModal;

	return referredToInterview === 'yes' ? (
		<CandidateDidInterview
            appSysId={appSysId}
            rejectionEmailModal={rejectionEmailModal}
            setRejectionEmailModal={setRejectionEmailModal}
            rejectionEmailSent = {rejectionEmailSent}
	        sendRejectionEmail = {sendRejectionEmail}
        />
	) : (
		<CandidateDidNotInterview
            appSysId={appSysId}
            rejectionEmailModal={rejectionEmailModal}
            setRejectionEmailModal={setRejectionEmailModal}
            rejectionEmailSent = {rejectionEmailSent}
	        sendRejectionEmail = {sendRejectionEmail}
        />
	);
};

export default rejectionEmailModal;