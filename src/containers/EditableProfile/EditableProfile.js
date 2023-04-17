import './EditableProfile.css';
import EditableField from '../../components/UI/EditableField/EditableField'
import EditableDropDown from '../../components/UI/EditableDropDown/EditableDropDown'
import useAuth from '../../hooks/useAuth';
import { SAVE_PROFILE } from '../../constants/ApiEndpoints';
import { Button, Menu, Dropdown, Form, Input, Col, Row, Divider } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ProfileContext from '../Profile/Util/FormContext';
import { convertDataToBackend } from '../Profile/Util/ConvertDataToBackend';

const editableProfile = (props) => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(ProfileContext);
	const { profile } = contextValue;
	const { setCurrentProfileInstance } = contextValue;

	useEffect(() => {
		setCurrentProfileInstance(formInstance);
	}, []);

	/*const [firstName, setFirstName] = useState('');
	const [middleName, setMiddleName] = useState('');
	const [lastName, setLastName] = useState('');
	const [address, setAddress] = useState('');
	const [addressOptional, setAddressOptional] = useState('');
	const [city, setCity] = useState('');
	const [stateName, setStateName] = useState('');
	const [country, setCountry] = useState('');
	const [zip, setZip] = useState('');
	const [email, setEmail] = useState('');
	const [emailConfirm, setEmailConfirm] = useState('');
	const [phone, setPhone] = useState('');
	const [phoneBusiness, setPhoneBusiness] = useState('');
	const [education, setEducation] = useState('');
	const [citizenship, setCitizenship] = useState(''); */

	const cancel = async () => {
		// todo
	};

	const save = async () => {

	let data = {
		basic_info : {
			first_name: firstName,
			middle_name: middleName,
			last_name: lastName,
			address: {
				address: address,
				address_2: addressOptional,
				city: city,
				state_province: stateName,
				country: country,
				zip_code: zip
			},
			email: email,
			email_confirm: emailConfirm,
			phone: phone,
			business_phone: phoneBusiness,
			highest_level_of_education: education,
			us_citizen: citizenship.toLowerCase() == "true" ? 1 : 0
		},
		demographics : {},
		references : [
			{
				first_name: "",
				last_name: "",
				email: "",
				phone: "",
				organization: "",
				title: "",
				contact_allowed: "true".toLowerCase() == "true" ? 1 : 0
			},
			{
				first_name: "",
				last_name: "",
				email: "",
				phone: "",
				organization: "",
				title: "",
				contact_allowed: "true".toLowerCase() == "true" ? 1 : 0
			}
		]
	};
		const saveDraftResponse = await axios.post(SAVE_PROFILE, data);
		alert('response: ' + saveDraftResponse)

//		alert('heres the obj: ' + JSON.stringify(data	));
	};
	
	const {
		auth: { iTrustGlideSsoId, isUserLoggedIn, user, oktaLoginAndRedirectUrl },
	} = useAuth();

	const handleMenuClick = (e) => {
		console.log('todo');
	};

	const educationMenu = ["Bachelors", "Masters", "Doctorate"];
	const yesNoMenu = ["Yes", "No"];

	return (

		<Form
			name="basic"
			labelCol={{ span: 24 }}
			wrapperCol={{ span: 24 }}
			style={{ maxWidth: 600 }}
			form={formInstance}
			initialValues={profile.basicInfo}
			//onFinish={onFinish}
			//onFinishFailed={onFinishFailed}
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
					<EditableField label="Address" name="address" required={true} size="55" />
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<EditableField label="Address" name="address2" required={false} size="55" />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="City" name="city" required={true} size="18" />
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="State/Province" name="stateProvince" required={true} size="18" />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="Country" name="country" required={true} size="18" />
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="Zip/Postal Code" name="zip" required={true} size="18" />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="Email" name="email" required={true} size="18" />
				</Col>
				<Col span={4}> </Col>
				{/*<Col span={10}>
					<EditableField label="Confirm Email" size="18" />
				</Col> */}
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="Phone Number" name="phone" required={true} size="18" />
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="Business Phone Number (Optional)" name="businessPhone" required={false} size="18" />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableDropDown label="Highest Level of Education" menu={educationMenu} />
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableDropDown label="Are you a US citizen?" menu={yesNoMenu} />
				</Col>				
			</Row>
			<Row>
				<Col span={6}>
					<Button
						className='wider-button'
						style={{ border: 'none', color: '#015EA2' }}
						onClick={cancel}
					>
						cancel
					</Button>
				</Col>
				<Col span={12}></Col>
				<Col span={6}>
					<Button
						className='wider-button'
						style={{ border: 'none', color: '#015EA2' }}
						onClick={save}
					>
						save
					</Button>
				</Col>
			</Row>
			<Divider />
		</Form>
		
	);
};

export default editableProfile;
