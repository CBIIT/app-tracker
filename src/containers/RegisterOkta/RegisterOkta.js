import { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import axios from 'axios';
import './RegisterOkta.css';
import { CHECK_AUTH, CREATE_OKTA_USER } from '../../constants/ApiEndpoints';
import { useHistory } from 'react-router-dom';

const registerOkta = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState();
	const [oktaGlideSsoId, setOktaGlideSsoId] = useState();

	const [formInstance] = Form.useForm();

	const history = useHistory();

	useEffect(() => {
		async () => {
			setIsLoading(true);
			console.log('Loading...');
			const response = await axios.get(CHECK_AUTH);
			console.log('Response: ', response);
			setOktaGlideSsoId(response.data.result.okta_idp);
			setIsLoading(false);
		};
	}, []);

	const onSubmit = async (values) => {
		setIsLoading(true);

		try {
			const response = await axios.post(CREATE_OKTA_USER, values);
			setMessage(response.data.result);
		} catch (error) {
			setMessage('There was an error creating your Okta account.');
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

	return !isLoading ? (
		<div className='OktaOuterContainer'>
			<div className='OktaRegistration'>
				{message ? (
					<p>{message}</p>
				) : (
					<>
						<h1>Create your NCI account to access myRAS</h1>
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
							To access the Applicant Portal at NCI, you will need to create an
							NCI account.
						</p>
						<p>
							After you fill out the information below, you will receive an
							email from Okta with instructions on how to activate and
							authenticate your account.
						</p>
						<p>
							Okta is the platform that manages and provides security for NCI
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
										]}
									>
										<Input placeholder='Please enter' />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label='Confirm email'
										name='email'
										rules={[
											{ required: true, message: 'Please confirm your email' },
											{ type: 'email', message: 'Please enter a valid email' },
										]}
									>
										<Input placeholder='Please enter' />
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
										]}
									>
										<Input placeholder='Please enter' />
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
		<></>
	);
};

export default registerOkta;
