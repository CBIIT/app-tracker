import {
	Form,
	Input,
	Slider,
	DatePicker,
	InputNumber,
	Button,
	Select,
} from 'antd';
import './ApplicantAddress.css';

const onSubmit = (values) => {
	console.log('submitting:', values.user);
};

const ApplicantAddress = () => {
	return (
		<div className='form-container'>
			<Form layout='vertical' name='Address' onFinish={onSubmit}>
				<h3 className='form-title'>Address</h3>
				<div className='flex-container'>
					<Form.Item
						name={['user', 'address', 'one']}
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
					<Form.Item name={['user', 'address', 'two']} label='Address Line Two'>
						<Input placeholder='Please Enter' />
					</Form.Item>
				</div>
				<div className='flex-container'>
					<Form.Item
						name={['user', 'city']}
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
						name={['user', 'state/province']}
						label='State/Province'
						rules={[
							{
								required: true,
								message: 'Please enter state/province',
							},
						]}
					>
						<Input placeholder='Please Enter' />
					</Form.Item>
				</div>
				<div className='flex-container'>
					<Form.Item
						name={['user', 'country']}
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
						name={['user', 'zip']}
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
