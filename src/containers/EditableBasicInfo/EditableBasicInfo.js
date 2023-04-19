import './EditableBasicInfo.css';
import EditableField from '../../components/UI/EditableField/EditableField'
import EditableDropDown from '../../components/UI/EditableDropDown/EditableDropDown'
import useAuth from '../../hooks/useAuth';
import { SAVE_PROFILE } from '../../constants/ApiEndpoints';
import { Button, Menu, Dropdown, Form, Input, Col, Row, Divider, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ProfileContext from '../Profile/Util/FormContext';
import { convertDataToBackend } from '../Profile/Util/ConvertDataToBackend';

const editableBasicInfo = ({setBasicOpen}) => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(ProfileContext);
	const { profile } = contextValue;
	const { setCurrentProfileInstance } = contextValue;
	console.log(profile);
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

	const saveCurrentForm = async (result) => {
		const updatedForm = updateFormData(formData, result, currentStepObj.key);
		setFormData(updatedForm);
		return updatedForm;
	};

	const updateFormData = (currentForm, newValues, step) => {
		const updatedForm = { ...currentForm };
		switch (step) {
			case 'basicInfo':
				// (basic information) save to applicant
				updatedForm.basicInfo = { ...currentForm.basicInfo, ...newValues };
				return updatedForm;
			case 'address':
				// (address) save to applicant
				updatedForm.address = { ...currentForm.address, ...newValues };
				return updatedForm;
			case 'references':
				// (references) save to references
				updatedForm.references = newValues.references;
				return updatedForm;
			default:
				return updatedForm;
		}
	};

	const onSave = async (values) => {

		console.log(values);
		/*const saveDraftResponse = await axios.post(SAVE_PROFILE, data);*/

		try {
			const validationResult = await formInstance.validateFields();
			await saveCurrentForm(validationResult);
			window.scrollTo(0, 0);
		} catch (error) {
			message.error('Please fill out all required fields.');
		}

	};
	
	const {
		auth: { iTrustGlideSsoId, isUserLoggedIn, user, oktaLoginAndRedirectUrl },
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
			name="basic"
			labelCol={{ span: 24 }}
			wrapperCol={{ span: 24 }}
			style={{ maxWidth: 600 }}
			form={formInstance}
			initialValues={profile?.basicInfo}
			onFinish={onSave}
			autoComplete="off"
	  	>
			<Row>
				<Col span={10}>
					<EditableField label="First Name" name="firstName" required={true} namesize="18"/>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="Middle Name" name="middleName"  required={false} size="18" />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="Last Name" name="lastName" required={true} size="18" />
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<EditableField label="Address" name={['address', 'address']} required={true} size="55" />
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<EditableField label="Apartment Number or Suite" name={['address', 'address2']} required={false} size="55" />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="City" name={['address', 'city']} required={true} size="18" />
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="State/Province" name={['address', 'stateProvince']} required={true} size="18" />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="Country" name={['address', 'country']} required={true} size="18" />
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="Zip/Postal Code" name={['address', 'zip']} required={true} size="18" />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="Email" name="email" required={true} size="18" />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<Form.Item
							label="Phone"
							name="phone"
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
						label="Business Phone"
						name="businessPhone"
						rules={[{ required: false, message: 'Please provide an answer.' }]}
					>
						<Input								
								type='tel'
								addonBefore={businessPhonePrefixSelector}
								placeholder='(123) 456-7890'
								maxLength={16}
								name = "businessPhone"
						/>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableDropDown label="Highest Level of Education" name="highestLevelEducation" required={true} menu={educationMenu} />
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableDropDown label="Are you a US citizen?" name="isUsCitizen" required={true} menu={yesNoMenu} />
				</Col>				
			</Row>
			<Row>
				<Col span={6}>
					<Button
						className='wider-button'
						onClick={() => (setBasicOpen(false))}
					>
						Cancel
					</Button>
				</Col>
				<Col span={12}></Col>
				<Col span={6}>
					<Button
						className='wider-button'
						type='primary'
						htmlType='submit'
					>
						Save
					</Button>
				</Col>
			</Row>
		</Form>
		
	);
};

export default editableBasicInfo;
