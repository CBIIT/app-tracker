import './EditableDropDown.css';

const editableDropDown = (props) => (
	<div className='EditableFieldContainer' style={props.containerStyle}>
		<span style={props.labelStyle}>{props.label}</span><br/>
		<select value="editableOptions">
			{props.options.split(',').map((option) => (
				<option value={option}>{option}</option>
			))}
		</select>
	</div>
);

export default editableDropDown;
