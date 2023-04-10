import './EditableRadio.css';

const editableRadio = (props) => (
	<div className='EditableRadioContainer' style={props.containerStyle}>
		<span style={props.labelStyle}>{props.label}</span><br/>
		{props.options.split(',').map((option) => (
			<div key={option}>
				{/* once you start connecting this, remove the read only props */}
				<input type="radio" id={option + "Id"} name={option + "Radio"} value={option} readOnly={true}/>
				<label htmlFor={option + "Id"} readOnly={true}>{option}</label><br/>
			</div>
		))}
	</div>
);

export default editableRadio;
