import './InfoCard.css';

const infoCard = (props) => {
	return (
		<div
			className={`InfoCardContainer ${props.className || ''}`}
			style={props.style}
		>
			<h3>{props.title}</h3>
			<hr />
			<div className='InfoCardContent'>{props.children}</div>
		</div>
	);
};

export default infoCard;
