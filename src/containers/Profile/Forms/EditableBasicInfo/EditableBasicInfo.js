import './EditableBasicInfo.css';
import EditableField from '../../../../components/UI/EditableField/EditableField';
import EditableRadio from '../../../../components/UI/EditableRadio/EditableRadio'
import EditableDropDown from '../../../../components/UI/EditableDropDown/EditableDropDown';
import useAuth from '../../../../hooks/useAuth';
import { SAVE_PROFILE } from '../../../../constants/ApiEndpoints';
import {
	Button,
	Form,
	Input,
	Col,
	Row,
	Select,
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ProfileContext from '../../Util/FormContext';
import { convertDataToBackend } from '../../Util/ConvertDataToBackend';

const editableBasicInfo = ({ setBasicOpen }) => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(ProfileContext);
	const { profile } = contextValue;
	const { setCurrentProfileInstance, setProfile } = contextValue;
	useEffect(() => {
		setCurrentProfileInstance(formInstance);
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

	const onSave = async (values) => {

		var valid = false;

		try {
			const validationResult = await formInstance.validateFields();
			//console.log("result = " + JSON.stringify(validationResult));
			console.log(validationResult);
			window.scrollTo(0, 0);
			valid = true;
		} catch (error) {
			console.log(error);
		}

		if (valid){
			let data = {
				...profile, 
				basicInfo: values
			}
			setProfile(data);
			const saveDraftResponse = await axios.post(SAVE_PROFILE, convertDataToBackend(data));
			setBasicOpen(false);
		}
	};
	// if hasProfile reload location : else set active tab to demographics
	const {
		auth: { user },
	} = useAuth();

	const handleMenuClick = (e) => {
		console.log('todo');
	};

	const educationMenu = [
		{ label: 'Bachelors', value: 'Bachelors' },
		{ label: 'Masters', value: 'Masters' },
		{ label: 'Doctorate', value: 'Doctorate' },
	];
	const yesNoMenu = [
		{ label: 'Yes', value: 1 },
		{ label: 'No', value: 0 },
	];

	return (
		<Form
			name='basic'
			labelCol={{ span: 24 }}
			wrapperCol={{ span: 24 }}
			style={{ maxWidth: 600 }}
			form={formInstance}
			initialValues={profile?.basicInfo}
			onFinish={onSave}
			autoComplete='off'
		>
			<Row>
				<h3>Basic Information</h3>
				<p>Let's start with some basic questions. You'll have a chance to review everything before submitting.</p>
			</Row>
			<Row>
				<Col span={6}>
					<EditableField
						label='First Name'
						name='firstName'
						required={true}
						namesize='18'
					/>
				</Col>
				<Col span={3}> </Col>
				<Col span={6}>
					<EditableField
						label='Middle Name'
						name='middleName'
						required={false}
						size='18'
					/>
				</Col>
				<Col span={3}> </Col>
				<Col span={6}>
					<EditableField
						label='Last Name'
						name='lastName'
						required={true}
						size='18'
					/>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<EditableField label='Email' name='email' required={true} size='18' />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<Form.Item
						label='Phone'
						name='phone'
						rules={[{ required: false, message: 'Please provide an answer.' }]}
					>
						<Input
							type='tel'
							addonBefore={phonePrefixSelector}
							placeholder='(123) 456-7890'
							maxLength={16}
							name = "phone"
						/>
					</Form.Item>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<Form.Item
						label='Business Phone'
						name='businessPhone'
						rules={[{ required: false, message: 'Please provide an answer.' }]}
					>
						<Input
							type='tel'
							addonBefore={businessPhonePrefixSelector}
							placeholder='(123) 456-7890'
							maxLength={16}
							name='businessPhone'
						/>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12}>
					<EditableDropDown
						label='Highest Level of Education'
						name='highestLevelEducation'
						required={true}
						menu={educationMenu}
					/>
				</Col>
				<Col span={4}> </Col>
				<Col span={8}>
					<EditableRadio
						label='Are you a US citizen?'
						name='isUsCitizen'
						required={true}
						options={yesNoMenu}
					/>
				</Col>
			</Row>
			<Row>
				<h3>Address</h3>
			</Row>
			<Row>
				<p>Please provide your mailing address.</p>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField
						label='Address'
						name={['address', 'address']}
						required={true}
						size='55'
					/>
				</Col>
				<Col span={4}/>
				<Col span={10}>
					<EditableField
						label='Apartment Number or Suite'
						name={['address', 'address2']}
						required={false}
						size='55'
					/>
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField
						label='City'
						name={['address', 'city']}
						required={true}
						size='18'
					/>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField
						label='State/Province'
						name={['address', 'stateProvince']}
						required={true}
						size='18'
					/>
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField
						label='Country'
						name={['address', 'country']}
						required={true}
						size='18'
					/>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField
						label='Zip/Postal Code'
						name={['address', 'zip']}
						required={true}
						size='18'
					/>
				</Col>
			</Row>
			<Row>
				{!user.hasProfile ? (
					<></>
				) : (
					<>
						<Col span={6}>
							<Button
								className='wider-button'
								onClick={() => setBasicOpen(false)}
							>
								Cancel
							</Button>
						</Col>
						<Col span={12}></Col>
					</>
				)}
				<Col span={6}>
					<Button className='wider-button' type='primary' htmlType='submit'>
						Save
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default editableBasicInfo;
