import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import './RegisterOkta.css';

const registerOkta = () => {
	const [formInstance] = Form.useForm();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState();

	const onSubmit = async (values) => {
		setIsLoading(true);

		try {
			const response = await axios.post(
				'/api/x_g_nci_app_tracke/login/create_okta_user',
				values
			);
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

	return (
		<div className='OktaRegistration'>
			{message ? (
				<p>{message}</p>
			) : (
				<Form
					layout='vertical'
					requiredMark={false}
					name='RegisterOkta'
					form={formInstance}
					onFinish={onSubmit}
				>
					<Form.Item
						label='First Name'
						name='firstname'
						rules={[
							{ required: true, message: 'Please enter your first name' },
						]}
					>
						<Input placeholder='Please enter' />
					</Form.Item>
					<Form.Item
						label='Last Name'
						name='lastname'
						rules={[{ required: true, message: 'Please enter your last name' }]}
					>
						<Input placeholder='Please enter' />
					</Form.Item>
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
					<Form.Item
						label='Phone Number'
						name='phone'
						rules={[
							{ required: true, message: 'Please enter your phone number' },
						]}
					>
						<Input placeholder='Please enter' />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' loading={isLoading}>
							Submit
						</Button>
					</Form.Item>
				</Form>
			)}
		</div>
	);
};

export default registerOkta;
