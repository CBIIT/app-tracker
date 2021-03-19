import { Form, Input, Slider, Button, Select, Radio } from 'antd';
import './ApplicantBasicInfo.css';

const { Option } = Select;

const ApplicantBasicInfo = () => {
	const phonePrefixSelector = (
		<Form.Item name='phonePrefix' noStyle>
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

	const busPhonePrefixSelector = (
		<Form.Item name='busPhonePrefix' noStyle>
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

	const onSubmit = (values) => {
		console.log('submitting:', values);
	};

	return (
		<Form
			layout='vertical'
			name='BasicInfo'
			className='basicInfoForm'
			onFinish={onSubmit}
		>
			<div className='form-desc'>
				<h3 className='form-title'>Basic Information</h3>
				<p className='title-desc'>
					Let’s start with some basic questions. You’ll have a chance to review
					everything before submitting.
				</p>
			</div>
			<div className='names'>
				<Form.Item
					name={['user', 'name', 'first']}
					label='First Name'
					rules={[
						{
							required: true,
							message: 'Please enter first name',
						},
					]}
				>
					<Input placeholder='Please Enter' />
				</Form.Item>
				<Form.Item name={['user', 'name', 'middle']} label='Middle Name'>
					<Input placeholder='Please Enter' />
				</Form.Item>
				<Form.Item
					name={['user', 'name', 'last']}
					label='Last Name'
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
			<div className='emailDiv'>
				<Form.Item
					name={['user', 'email']}
					label='Email Address'
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
			</div>
			<div className='phones'>
				<Form.Item
					name={['user', 'phone-number']}
					label='Phone Number'
					rules={[
						{
							required: true,
							message: 'Please enter a valid phone number',
						},
					]}
				>
					<Input
						type='tel'
						addonBefore={phonePrefixSelector}
						placeholder='(123) 456-7890'
					/>
				</Form.Item>
				<Form.Item
					name={['user', 'business-number']}
					label='Business Phone Number'
				>
					<Input
						type='tel'
						addonBefore={busPhonePrefixSelector}
						placeholder='(123) 456-7890'
					/>
				</Form.Item>
			</div>
			<div className='degree'>
				<Form.Item
					name={['user', 'degree']}
					label='Do you possess a Doctorate Degree?'
					rules={[
						{
							message: 'Value should be yes or no',
							required: true,
						},
					]}
				>
					<Radio.Group>
						<Radio value='Yes'>Yes</Radio>
						<Radio value='No'>No</Radio>
					</Radio.Group>
				</Form.Item>
			</div>
		</Form>
	);
};

export default ApplicantBasicInfo;
