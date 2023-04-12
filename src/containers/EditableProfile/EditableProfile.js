import './EditableProfile.css';
import EditableField from '../../components/UI/EditableField/EditableField'
import EditableDropDown from '../../components/UI/EditableDropDown/EditableDropDown'
import EditableReferences from '../EditableReferences/EditableReferences'
import useAuth from '../../hooks/useAuth';
import { SAVE_PROFILE } from '../../constants/ApiEndpoints';
import { Button } from 'antd';
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
			us_citizen: citizenship
		},
		demographics : {},
		references : []
	};

	/*	let data = {
			basic_info : {
				address: {
					address2: "",
					city: "",
					state: ""
				}
			},
			demographics : {},
			references : []
		};*/
	
		const saveDraftResponse = await axios.post(SAVE_PROFILE, data);
		alert('response: ' + saveDraftResponse)

//		alert('heres the obj: ' + JSON.stringify(data	));
	};
	
	const {
		auth: { iTrustGlideSsoId, isUserLoggedIn, user, oktaLoginAndRedirectUrl },
	} = useAuth();

	return (
		<div className='EditableProfileContainer' style={{display: !user.hasProfile ? 'block' : 'none' }}>
			<h2 style={{ marginBottom: '3px' }}>{user.firstName} {user.lastInitial}</h2>
			<EditableField label="First Name" size="18" callback={(childdata) => setFirstName(childdata.target.value)}/>
			<EditableField label="Middle Name" size="18" callback={(childdata) => setMiddleName(childdata.target.value)}/>
			<EditableField label="Last Name" size="18" callback={(childdata) => setLastName(childdata.target.value)}/>
			<EditableField label="Address" size="55" callback={(childdata) => setAddress(childdata.target.value)}/>
			<EditableField label="Address (optional)" size="55" callback={(childdata) => setAddressOptional(childdata.target.value)}/>
			<EditableField label="City" size="18" callback={(childdata) => setCity(childdata.target.value)}/>
			<EditableField label="State/Province" size="18" callback={(childdata) => setStateName(childdata.target.value)}/>
			<EditableField label="Country" size="18" callback={(childdata) => setCountry(childdata.target.value)}/>
			<EditableField label="Zip/Postal Code" size="18" callback={(childdata) => setZip(childdata.target.value)}/>
			<EditableField label="Email" size="18" callback={(childdata) => setEmail(childdata.target.value)}/>
			<EditableField label="Confirm Email" size="18" callback={(childdata) => setEmailConfirm(childdata.target.value)}/>
			<EditableField label="Phone Number" size="18" callback={(childdata) => setPhone(childdata.target.value)}/>
			<EditableField label="Business Phone Number (Optional)" size="18" callback={(childdata) => setPhoneBusiness(childdata.target.value)}/>
			<EditableDropDown label="Highest Level of Education" defaultValue={{value: 'Bachelors', label: 'Bachelors'}} options={[{value:"Bachelors",label:"Bachelors"},{value:"Masters",label:"Masters"},{value:"Doctorate",label:"Doctorate"}]} callback={(childdata) => setEducation(childdata.value)}/>
			<EditableDropDown label="Are you a US citizen?" defaultValue={{value: 'Yes', label: 'Yes'}} options={[{value:"Yes",label:"Yes"},{value:"No",label:"No"}]} callback={(childdata) => setCitizenship(childdata.value)}/>
			<EditableReferences/>
			<Button
				className='wider-button'
				style={{ border: 'none', color: '#015EA2' }}
				onClick={save}
			>
				save
			</Button>
		</div>
	);
};

export default editableProfile;
