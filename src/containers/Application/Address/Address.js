import LabelValuePair from '../../../components/UI/LabelValuePair/LabelValuePair';
import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../../components/UI/InfoCard/InfoCardRow/InfoCardRow';

const address = (props) => {
	const { address, address2, city, stateProvince, postalCode, country } =
		props?.address;

	return (
		<InfoCard title='Address' style={props.style}>
			<InfoCardRow>
				<LabelValuePair label='Address Line 1' value={address} />
				<LabelValuePair label='Address Line 2' value={address2} />
			</InfoCardRow>
			<InfoCardRow>
				<LabelValuePair label='City' value={city} />
				<LabelValuePair label='State' value={stateProvince} />
				<LabelValuePair label='Postal Code' value={postalCode} />
			</InfoCardRow>
			{country ? (
				<InfoCardRow>
					<LabelValuePair label='Country' value={country} />
				</InfoCardRow>
			) : null}
		</InfoCard>
	);
};

export default address;
