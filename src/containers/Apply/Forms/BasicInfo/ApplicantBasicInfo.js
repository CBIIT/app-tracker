import { useContext, useEffect } from 'react';
import { Form, Input, Select, Radio } from 'antd';
import './ApplicantBasicInfo.css';
import FormContext from '../../Context';

const { Option } = Select;

const ApplicantBasicInfo = () => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(FormContext);
	const { formData } = contextValue;

	useEffect(() => {
		const { setCurrentFormInstance } = contextValue;
		setCurrentFormInstance(formInstance);
	}, []);

	const phonePrefixSelector = (
		<Form.Item name='phonePrefix' noStyle>
			<Select
				style={{
					width: 70,
				}}
			>
				<Option value='+1'>+1</Option>
				<Option value='+86'>+86</Option>
				<Option value='+87'>+87</Option>
			</Select>
		</Form.Item>
	);

	const businessPhonePrefixSelector = (
		<Form.Item name='businessPhonePrefix' noStyle>
			<Select
				style={{
					width: 70,
				}}
			>
				<Option value='+1'>+1</Option>
				<Option value='+86'>+86</Option>
				<Option value='+87'>+87</Option>
			</Select>
		</Form.Item>
	);

	return (
		<Form
			form={formInstance}
			initialValues={formData.basicInfo}
			requiredMark={false}
			layout='vertical'
			className='basicInfoForm'
		>
			<div className='names'>
				<Form.Item
					name='firstName'
					label='First Name'
					rules={[
						{
							required: true,
							message: 'Please enter first name',
						},
					]}
				>
					<Input placeholder='Please Enter' maxLength={100} />
				</Form.Item>
				<Form.Item name='middleName' label='Middle Name'>
					<Input placeholder='Please Enter' maxLength={100} />
				</Form.Item>
				<Form.Item
					name='lastName'
					label='Last Name'
					rules={[
						{
							required: true,
							message: 'Please enter last name',
						},
					]}
				>
					<Input placeholder='Please Enter' maxLength={100} />
				</Form.Item>
			</div>
			<div className='emailDiv'>
				<Form.Item
					name='email'
					label='Email Address'
					rules={[
						{
							type: 'email',
							required: true,
							message: 'Please enter a valid email address',
						},
					]}
				>
					<Input type='email' placeholder='Please Enter' maxLength={100} />
				</Form.Item>
			</div>
			<div className='phones'>
				<Form.Item
					name='phone'
					label='Phone Number'
					rules={[
						{
							required: true,
							message: 'Please enter a valid phone number',
						},
						() => ({
							validator(_, value) {
								let regEx = new RegExp(
									'^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$'
								);

								if (!value || regEx.test(value) == true) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error('Please enter a valid phone number')
								);
							},
						}),
					]}
				>
					<Input
						type='tel'
						addonBefore={phonePrefixSelector}
						placeholder='(123) 456-7890'
						maxLength={16}
					/>
				</Form.Item>
				<Form.Item
					name='businessPhone'
					label='Business Phone Number'
					rules={[
						() => ({
							validator(_, value) {
								const regEx = new RegExp(
									'^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$'
								);

								if (!value || regEx.test(value) == true) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error('Please enter a valid phone number')
								);
							},
						}),
					]}
				>
					<Input
						type='tel'
						addonBefore={businessPhonePrefixSelector}
						placeholder='(123) 456-7890'
						maxLength={16}
					/>
				</Form.Item>
			</div>
			<div className='ApplicantBasicInfoRow'>
				<div className='ApplicantBasicInfoRowItem'>
					<Form.Item
						name='highestLevelEducation'
						label='Highest Level of Education'
						rules={[
							{
								message: 'Please select an option',
								required: true,
							},
						]}
					>
						<Select>
							<Option value='Doctorate'>Doctorate</Option>
							<Option value='Masters'>Masters</Option>
							<Option value='Bachelors'>Bachelors</Option>
						</Select>
					</Form.Item>
				</div>
				<div className='ApplicantBasicInfoRowItem'>
					<Form.Item
						name='isUsCitizen'
						label='Are you a US citizen?'
						rules={[
							{
								message: 'Please select an option',
								required: true,
							},
						]}
					>
						<Radio.Group>
							<Radio value='true'>Yes</Radio>
							<Radio value='false'>No</Radio>
						</Radio.Group>
					</Form.Item>
				</div>
			</div>
		</Form>
	);
};

export default ApplicantBasicInfo;
