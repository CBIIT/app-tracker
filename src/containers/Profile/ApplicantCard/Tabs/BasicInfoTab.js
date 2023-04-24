import { useEffect, useState, useContext } from 'react';
import { Avatar, Card, message, Typography, Divider } from 'antd';
const { Paragraph, Title } = Typography;
import ProfileContext from '../../Util/FormContext';
import editableBasicInfo from '../../Forms/EditableBasicInfo/EditableBasicInfo';

const BasicInfoTab = () => {

    const [basicOpen, setBasicOpen] = useState(false);
    const contextValue = useContext(ProfileContext);
    const { profile } = contextValue;
    const { basicInfo, demographics } = profile;
	const address = basicInfo?.address;
    
    const getEthnicity = (value) => {
		switch (value) {
			case '1':
				return 'Hispanic or Latino';
			case '0':
				return 'Not Hispanic or Latino';
			default:
				return '';
		}
	};

	const getFullNumber = (prefix, number) => {
		const areaCode = number.slice(0, 3);
		const firstHalf = number.slice(3, 6);
		const secondHalf = number.slice(6);
		return `${prefix} (${areaCode}) ${firstHalf} - ${secondHalf}`;
	};

	const getFirstInitial = (first) => {
		const firstName = first.split('');
		return firstName[0];
	};

	const getLastInitial = (last) => {
		const lastName = last.split('');
		return lastName[0];
	};

    return(
        <div style={{ marginLeft: '60px', marginRight: '60px' }}>
            {basicOpen ? (
                <EditableBasicInfo setBasicOpen={setBasicOpen} />
            ) : (
                <>
                    <div style={{ marginBottom: '25px' }}>
                        <div>
                            <a onClick={() => setBasicOpen(true)}>Edit</a>
                        </div>
                        <Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
                            Address
                        </Title>
                        <Paragraph style={{ color: '#363636' }}>
                            {address.address2
                                ? address.address + ' ' + address.address2
                                : address.address}
                            <br />
                            {`${address.city}, ${address.stateProvince} ${address.zip}`}
                            <br />
                            {address.country}
                        </Paragraph>
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
                            Email
                        </Title>
                        <Paragraph style={{ color: '#363636' }}>
                            {basicInfo.email}
                        </Paragraph>
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
                            Mobile
                        </Title>
                        <Paragraph style={{ color: '#363636' }}>
                            {getFullNumber(basicInfo.phonePrefix, basicInfo.phone)}
                        </Paragraph>
                    </div>
                </>
            )}
            <Divider />

        </div>
    );
};
export default BasicInfoTab;