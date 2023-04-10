import './EditableDropDown.css';

const editableDropDown = (props) => (
	<div className='EditableDropDownContainer' style={props.containerStyle}>
		<span style={props.labelStyle}>{props.label}</span><br/>
		<select value="editableOptions" readOnly={true}>
			{/* once you start connecting this, remove the read only props */}
			{props.options.split(',').map((option) => (
				<option key={option} value={option}>{option}</option>
			))}
		</select>
	</div>
);

export default editableDropDown;
