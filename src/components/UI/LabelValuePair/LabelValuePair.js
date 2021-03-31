import './LabelValuePair.css';

const labelValuePair = (props) => (
	<div className='LabelValuePairContainer'>
		<h2>{props.label}</h2>
		<span>{props.value}</span>
	</div>
);

export default labelValuePair;
