import './EditableProfile.css';
import EditableField from '../EditableField/EditableField'

const editableProfile = (props) => (
	<div className='EditableProfileContainer' style={props.containerStyle}>
		<EditableField label="First Name" size="18"/>
		<EditableField label="Middle Name" size="18"/>
		<EditableField label="Last Name" size="18"/>
		<EditableField label="Address" size="55"/>
		<EditableField label="Address (optional)" size="55"/>
		<EditableField label="City" size="18"/>
		<EditableField label="State/Province" size="18"/>
		<EditableField label="Country" size="18"/>
		<EditableField label="Zip/Postal Code" size="18"/>
		<EditableField label="Email" size="18"/>
		<EditableField label="Confirm Email" size="18"/>
		<EditableField label="Phone Number" size="18"/>
		<EditableField label="Business Phone Number (Optional)" size="18"/>
		<EditableField label="Highest Level of Education" size="55"/>
		<EditableField label="Are you a US citizen?" size="18"/>
	</div>
);

export default editableProfile;
