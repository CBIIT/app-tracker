import LabelValuePair from '../../../components/UI/LabelValuePair/LabelValuePair';
import InfoCard from '../../../components/UI/InfoCard/InfoCard';
import InfoCardRow from '../../../components/UI/InfoCard/InfoCardRow/InfoCardRow';

const address = (props) => {
	const { address1, address2, city, stateProvince, postalCode } = props.address;

	return (
		<InfoCard title='Address' style={props.style}>
			<InfoCardRow>
				<LabelValuePair label='Address Line 1' value={address1} />
				<LabelValuePair label='Address Line 2' value={address2} />
			</InfoCardRow>
			<InfoCardRow>
				<LabelValuePair label='City' value={city} />
				<LabelValuePair label='State' value={stateProvince} />
				<LabelValuePair label='Postal Code' value={postalCode} />
			</InfoCardRow>
		</InfoCard>
	);
};

export default address;
