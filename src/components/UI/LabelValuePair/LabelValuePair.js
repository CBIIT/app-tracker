import './LabelValuePair.css';

const labelValuePair = (props) => (
	<div className='LabelValuePairContainer' style={props.containerStyle}>
		<h2 style={props.labelStyle}>{props.label}</h2>
		<span style={props.valueStyle}>{props.value}</span>
	</div>
);

export default labelValuePair;
