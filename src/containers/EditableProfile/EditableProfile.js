import './EditableProfile.css';
import EditableField from '../../components/UI/EditableField/EditableField'
import EditableDropDown from '../../components/UI/EditableDropDown/EditableDropDown'
import EditableReferences from '../EditableReferences/EditableReferences'
import useAuth from '../../hooks/useAuth';
import { SAVE_PROFILE } from '../../constants/ApiEndpoints';
import { Button, Menu, Dropdown, Form, Input, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const editableProfile = (props) => {

	const [firstName, setFirstName] = useState('');
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
	const [citizenship, setCitizenship] = useState('');

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

	const educationMenu = (
		<Menu>
		  <Menu.Item key="Bachelors"> Bachelors </Menu.Item>
		  <Menu.Item key="Masters"> Masters </Menu.Item>
		  <Menu.Item key="Doctorate"> Doctorate </Menu.Item>
		</Menu>
	  );

	  const yesNoMenu = (
		<Menu>
		  <Menu.Item key="Yes"> Bachelors </Menu.Item>
		  <Menu.Item key="No"> Masters </Menu.Item>
		</Menu>
	  );

	return (

		<Form
			name="basic"
			labelCol={{ span: 24 }}
			wrapperCol={{ span: 24 }}
			style={{ maxWidth: 600 }}
			initialValues={{ remember: true }}
			//onFinish={onFinish}
			//onFinishFailed={onFinishFailed}
			autoComplete="off"
	  	>
			<Row>

				<Col span={10}>
					<EditableField label="First Name" size="18" callback={(childdata) => setFirstName(childdata.target.value)}/>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="Middle Name" size="18" callback={(childdata) => setMiddleName(childdata.target.value)}/>
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="Last Name" size="18" callback={(childdata) => setLastName(childdata.target.value)}/>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<EditableField label="Address" size="55" callback={(childdata) => setAddress(childdata.target.value)}/>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<EditableField label="Address (optional)" size="55" callback={(childdata) => setAddressOptional(childdata.target.value)}/>
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="City" size="18" callback={(childdata) => setCity(childdata.target.value)}/>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="State/Province" size="18" callback={(childdata) => setStateName(childdata.target.value)}/>
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="Country" size="18" callback={(childdata) => setCountry(childdata.target.value)}/>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="Zip/Postal Code" size="18" callback={(childdata) => setZip(childdata.target.value)}/>
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="Email" size="18" callback={(childdata) => setEmail(childdata.target.value)}/>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="Confirm Email" size="18" callback={(childdata) => setEmailConfirm(childdata.target.value)}/>
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField label="Phone Number" size="18" callback={(childdata) => setPhone(childdata.target.value)}/>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField label="Business Phone Number (Optional)" size="18" callback={(childdata) => setPhoneBusiness(childdata.target.value)}/>
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
			<EditableReferences/>
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
		</Form>
		
	);
};

export default editableProfile;
