import { useEffect, useContext } from 'react';
import { Form, Input } from 'antd';

import FormContext from '../../Context';
import './ApplicantAddress.css';

const ApplicantAddress = () => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(FormContext);
	const { formData } = contextValue;

	useEffect(() => {
		const { setCurrentFormInstance } = contextValue;
		setCurrentFormInstance(formInstance);
	}, []);

	return (
		<div className='form-container'>
			<Form
				form={formInstance}
				initialValues={formData.address}
				requiredMark={false}
				layout='vertical'
				name='address'
			>
				<div className='flex-container'>
					<Form.Item
						name='address'
						label='Address Line One'
						rules={[
							{
								required: true,
								message: 'Please enter address',
							},
						]}
					>
						<Input placeholder='Please Enter' />
					</Form.Item>
					<Form.Item name='address2' label='Address Line Two'>
						<Input placeholder='Please Enter' />
					</Form.Item>
				</div>
				<div className='flex-container'>
					<Form.Item
						name='city'
						label='City'
						rules={[
							{
								required: true,
								message: 'Please enter city',
							},
						]}
					>
						<Input placeholder='Please Enter' />
					</Form.Item>
					<Form.Item
						name='stateProvince'
						label='State/Province'
						rules={[
							{
								message: 'Please enter state/province',
							},
						]}
					>
						<Input placeholder='Please Enter' />
					</Form.Item>
				</div>
				<div className='flex-container'>
					<Form.Item
						name='country'
						label='Country'
						rules={[
							{
								required: true,
								message: 'Please enter state/province',
							},
						]}
					>
						<Input placeholder='Please Enter' />
					</Form.Item>
					<Form.Item
						name='zip'
						label='Zip / Postal Code'
						rules={[
							{
								required: true,
								message: 'Please enter zip/postal code',
							},
						]}
					>
						<Input placeholder='Please Enter' />
					</Form.Item>
					{/* <Form.Item
				name={['user', 'zip']}
				label='Zip / Postal Code'
				style={{
					display: 'inline-block',
					marginLeft: '10px',
					width: '375.55px',
				}}
				rules={[
					{
						required: true,
						message: 'Please enter zip/postal code',
					},
					() => ({
						validator(_, value) {
							let regEx = new RegExp('^([0-9]{5})(?:[-s]*([0-9]{4}))?$');

							if (!value || regEx.test(value) == true) {
								return Promise.resolve();
							}
							return Promise.reject(new Error('Enter a valid zip/postal code'));
						},
					}),
				]}
			>
				<Input placeholder='Please Enter' />
			</Form.Item> */}
				</div>
			</Form>
		</div>
	);
};

export default ApplicantAddress;
