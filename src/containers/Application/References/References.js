import InfoCard from '../../../components/UI/InfoCard/InfoCard';

const handleToggle = (isToggleOn) => {
	console.log('[References] isToggleOn: ', isToggleOn);
};

const references = (props) => (
	<div style={props.style}>
		<InfoCard
			title='References'
			onSwitchToggle={handleToggle}
			switchTitle='Display to committee members?'
		>
			<ul className='ApplicantDocumentList'>
				{props.references.map((reference, index) => (
					<li key={index}>
						<div className='LineItemItem'>{reference.name}</div>
						<div className='LineItemItem'>
							<a href={reference.document.downloadLink}>
								{reference.document.filename}
							</a>
						</div>
					</li>
				))}
			</ul>
		</InfoCard>
	</div>
);

export default references;
