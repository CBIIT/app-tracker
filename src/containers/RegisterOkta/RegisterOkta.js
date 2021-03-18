import { Form, Input, Button } from 'antd';
import axios from 'axios';
const registerOkta = () => {
	const [formInstance] = Form.useForm();

	const onSubmit = async (values) => {
		console.log('[RegisterOkta] data:' + JSON.stringify(values, null, 2));
		const response = await axios.post(
			'/api/x_g_nci_app_tracke/login/create_okta_user',
			values
		);
		console.log(
			'[RegisterOkta] register response: ' + JSON.stringify(response, null, 2)
		);
	};

	return (
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
				rules={[{ required: true, message: 'Please enter a title' }]}
			>
				<Input placeholder='Please enter' />
			</Form.Item>
			<Form.Item
				label='Last Name'
				name='lastname'
				rules={[{ required: true, message: 'Please enter a title' }]}
			>
				<Input placeholder='Please enter' />
			</Form.Item>
			<Form.Item
				label='Email'
				name='email'
				rules={[
					{ required: true, message: 'Please enter a title' },
					{ type: 'email' },
				]}
			>
				<Input placeholder='Please enter' />
			</Form.Item>
			<Form.Item
				label='Phone Number'
				name='phone'
				rules={[{ required: true, message: 'Please enter a title' }]}
			>
				<Input placeholder='Please enter' />
			</Form.Item>
			<Form.Item>
				<Button type='primary' htmlType='submit'>
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
};

export default registerOkta;
