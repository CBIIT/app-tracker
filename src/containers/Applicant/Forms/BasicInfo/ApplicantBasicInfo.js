import {
	Form,
	Input,
	Slider,
	DatePicker,
	InputNumber,
	Button,
	Select,
} from 'antd';
import './ApplicantBasicInfo.css';

const ApplicantBasicInfo = () => {
	console.log('lala');

	const phonePrefixSelector1 = (
		<Form.Item name='prefix1' noStyle>
			<Select
				defaultValue='+1'
				style={{
					width: 70,
				}}
			>
				<Option value='1'>+1</Option>
				<Option value='86'>+86</Option>
				<Option value='87'>+87</Option>
			</Select>
		</Form.Item>
	);

	const phonePrefixSelector2 = (
		<Form.Item name='prefix2' noStyle>
			<Select
				defaultValue='+1'
				style={{
					width: 70,
				}}
			>
				<Option value='1'>+1</Option>
				<Option value='86'>+86</Option>
				<Option value='87'>+87</Option>
			</Select>
		</Form.Item>
	);

	return (
		<Form layout='vertical' name='BasicInfo' style={{ paddingLeft: '10px' }}>
			<h3 className='form-title'>Basic Information</h3>
			<p className='title-desc'>
				Let’s start with some basic questions. You’ll have a chance to review
				everything before submitting.
			</p>
			<div className='names'>
				<Form.Item
					name={['user', 'name', 'first']}
					label='First Name'
					style={{ display: 'inline-block' }}
					rules={[
						{
							required: true,
							message: 'Please enter first name',
						},
					]}
				>
					<Input placeholder='Please Enter' />
				</Form.Item>
				<Form.Item
					name={['user', 'name', 'middle']}
					label='Middle Name'
					style={{ display: 'inline-block', marginLeft: '10px' }}
				>
					<Input placeholder='Please Enter' />
				</Form.Item>
				<Form.Item
					name={['user', 'name', 'last']}
					label='Last Name'
					style={{ display: 'inline-block', marginLeft: '10px' }}
					rules={[
						{
							required: true,
							message: 'Please enter last name',
						},
					]}
				>
					<Input placeholder='Please Enter' />
				</Form.Item>
			</div>
			<Form.Item
				name={['user', 'email']}
				label='Email Address'
				style={{ width: '767px' }}
				rules={[
					{
						type: 'email',
						required: true,
						message: 'Please enter a valid email address',
					},
				]}
			>
				<Input type='email' placeholder='Please Enter' />
			</Form.Item>
			<Form.Item
				name={['user', 'phone-number']}
				label='Phone Number'
				style={{ display: 'inline-block' }}
				rules={[
					{
						required: true,
						message: 'Please enter a valid phone number',
					},
				]}
			>
				<Input
					type='tel'
					addonBefore={phonePrefixSelector1}
					placeholder='(123) 456-7890'
					style={{ width: '312.06px' }}
				/>
			</Form.Item>
			<Form.Item
				name={['user', 'business-number']}
				label='Business Phone Number'
				style={{ display: 'inline-block', marginLeft: '10px' }}
			>
				<Input
					type='tel'
					addonBefore={phonePrefixSelector2}
					placeholder='(123) 456-7890'
					style={{ width: '312.06px' }}
				/>
			</Form.Item>
			<Form.Item
				name={['user', 'degree']}
				label='Do you possess a Doctorate Degree?'
				style={{ width: '312.06px' }}
				rules={[
					{
						message: 'Value should be yes or no',
						required: true,
					},
				]}
			>
				<Input placeholder='Y/N' />
			</Form.Item>
			<Form.Item>
				<Button type='primary' htmlType='submit'>
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
};

export default ApplicantBasicInfo;
