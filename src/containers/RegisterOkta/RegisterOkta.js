import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Result } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import axios from 'axios';

import Loading from '../../components/Loading/Loading';
import { CHECK_AUTH, CREATE_OKTA_USER } from '../../constants/ApiEndpoints';
import './RegisterOkta.css';
const registerOkta = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState();
	const [error, setError] = useState(false);
	const [iTrustGlideSsoId, setItrustGlideSsoId] = useState();
	const [oktaGlideSsoId, setOktaGlideSsoId] = useState();
	const [isEmailNih, setIsEmailNih] = useState(false);

	const [formInstance] = Form.useForm();

	const history = useHistory();

	const emailNotMatchError = 'Emails do not match.';

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			const response = await axios.get(CHECK_AUTH);
			setItrustGlideSsoId(response.data.result.itrust_idp);
			setOktaGlideSsoId(response.data.result.okta_idp);
			setIsLoading(false);
		})();
	}, []);

	const checkIfNihEmail = (email) => {
		email.target.value.endsWith('@nih.gov') ||
		email.target.value.endsWith('@mail.nih.gov')
			? setIsEmailNih(true)
			: setIsEmailNih(false);
	};

	const onSubmit = async (values) => {
		setIsLoading(true);

		try {
			const response = await axios.post(CREATE_OKTA_USER, values);
			const result = response.data.result;
			if (
				result.includes(
					'An object with this field already exists in the current organization'
				)
			) {
				setMessage('This account already exists.  Please try logging in.');
				setError(true);
			} else if (result.includes('errorCode')) {
				setMessage(
					'An error occurred while trying to create your account.  Please try again later.  If the problem persists please contact 1-800-518-8474 or supportemail@mail.nih.gov'
				);
				setError(true);
			} else {
				setMessage(
					'User account created, please check your email for a message from Okta to activate your account'
				);
				setError(false);
			}
		} catch (error) {
			setMessage(
				'An error occurred while trying to create your account.  Please try again later.  If the problem persists please contact 1-800-518-8474 or supportemail@mail.nih.gov'
			);
			setError(true);
		}

		setIsLoading(false);

		// Error scenario
		//   "data": {
		//     "result": "Error creating user: {\"errorCode\":\"E0000001\",\"errorSummary\":\"Api validation failed: login\",\"errorLink\":\"E0000001\",\"errorId\":\"oae4hfGdCgIRMeduMeGyL4RmQ\",\"errorCauses\":[{\"errorSummary\":\"login: An object with this field already exists in the current organization\"}]}"
		//   },

		// Success scenario
		// "data": {
		// 	"result": "User account created, please check your email for a message from Okta to activate your account"
		//   },
	};

	const handleLoginButtonClick = () => {
		location.href =
			'/nav_to.do?uri=' +
			encodeURIComponent('/nci-scss.do') +
			'&glide_sso_id=' +
			oktaGlideSsoId;
	};

	const handleCancelButtonClick = () => {
		history.goBack();
	};

	const validateEmails = async () => {
		const email = formInstance.getFieldValue('email');
		const confirmEmail = formInstance.getFieldValue('confirmEmail');

		if (email && confirmEmail && email !== confirmEmail)
			throw new Error(emailNotMatchError);

		const emailErrors = formInstance.getFieldError('email');
		const confirmEmailErrors = formInstance.getFieldError('confirmEmail');

		const matchEmailErrorIndex = emailErrors.indexOf(emailNotMatchError);
		if (matchEmailErrorIndex !== -1)
			emailErrors.splice(matchEmailErrorIndex, 1);

		const matchConformEmailErrorIndex =
			confirmEmailErrors.indexOf(emailNotMatchError);
		if (matchConformEmailErrorIndex !== -1)
			confirmEmailErrors.splice(matchConformEmailErrorIndex, 1);

		formInstance.setFields([
			{
				name: 'email',
				errors: emailErrors,
			},
			{
				name: 'confirmEmail',
				errors: confirmEmailErrors,
			},
		]);
	};

	const validatePhoneNumber = async (_, phoneNumber) => {
		const phoneRegEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		if (phoneNumber && !phoneNumber.match(phoneRegEx))
			throw new Error('Please enter a valid phone number.');
	};

	return !isLoading ? (
		<div className='OktaOuterContainer'>
			<div className='OktaRegistration'>
				{message ? (
					<Result status={error ? 'warning' : 'success'} subTitle={message} />
				) : (
					<>
						<h1>Create your NCI account to access SCSS</h1>
						<h2>
							Already have an account?{' '}
							<Button
								className='OktaRegistrationLoginButton'
								type='link'
								onClick={handleLoginButtonClick}
							>
								Login
								<CaretRightOutlined style={{ fontSize: '12px' }} />
							</Button>
						</h2>
						<p>
							To access the Applicant Portal at NIH, you will need to create an
							NIH account.
						</p>
						<p>
							After you fill out the information below, you will receive an
							email from Okta with instructions on how to activate and
							authenticate your account.
						</p>
						<p>
							Okta is the platform that manages and provides security for NIH
							Accounts. If you do not receive an email from Okta within 24
							hours, please contact us at 1-800-518-8474 or{' '}
							<a href='mailto:supportemail@mail.nih.gov'>
								supportemail@mail.nih.gov
							</a>
						</p>
						<Form
							layout='vertical'
							requiredMark={false}
							name='RegisterOkta'
							form={formInstance}
							onFinish={onSubmit}
						>
							<Row gutter={24} className='OktaRegistrationRow'>
								<Col span={12}>
									<Form.Item
										label='First Name'
										name='firstname'
										rules={[
											{
												required: true,
												message: 'Please enter your first name',
											},
										]}
									>
										<Input placeholder='Please enter' />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label='Last Name'
										name='lastname'
										rules={[
											{
												required: true,
												message: 'Please enter your last name',
											},
										]}
									>
										<Input placeholder='Please enter' />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={24}>
								<Col span={12}>
									<Form.Item
										label='Email'
										name='email'
										rules={[
											{ required: true, message: 'Please enter your email' },
											{ type: 'email', message: 'Please enter a valid email' },
											{ validator: validateEmails },
										]}
									>
										<Input
											onChange={checkIfNihEmail}
											placeholder='example@email.com'
										/>
									</Form.Item>
									<p
										style={{
											backgroundColor: '#fffec8',
											marginBottom: '5px',
											display: isEmailNih === false ? 'none' : '',
										}}
									>
										You have entered an NIH email. Please use{' '}
										<a
											href={
												'/nav_to.do?uri=' +
												encodeURIComponent('/nci-scss.do') +
												'&glide_sso_id=' +
												iTrustGlideSsoId
											}
										>
											NIH Login
										</a>{' '}
										to sign in to SCSS.
									</p>
								</Col>
								<Col span={12}>
									<Form.Item
										label='Confirm Email'
										name='confirmEmail'
										rules={[
											{ required: true, message: 'Please confirm your email' },
											{ validator: validateEmails },
										]}
									>
										<Input placeholder='example@email.com' />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={24}>
								<Col span={12}>
									<Form.Item
										label='Phone Number'
										name='phone'
										rules={[
											{
												required: true,
												message: 'Please enter your phone number',
											},
											{ validator: validatePhoneNumber },
										]}
									>
										<Input type='tel' placeholder='(123) 456-7890' />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={24}>
								<Col span={12} style={{ textAlign: 'right' }}>
									<Button
										type='primary'
										ghost
										size='large'
										onClick={handleCancelButtonClick}
									>
										Cancel and Back
									</Button>
								</Col>
								<Col span={12} style={{ textAlign: 'left' }}>
									<Form.Item>
										<Button
											disabled={isEmailNih}
											type='primary'
											htmlType='submit'
											size='large'
											loading={isLoading}
										>
											Create Account
										</Button>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</>
				)}
			</div>
		</div>
	) : (
		<Loading />
	);
};

export default registerOkta;
