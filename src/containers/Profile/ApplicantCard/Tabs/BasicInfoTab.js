import { useState, useContext } from 'react';
import { Typography, Button, Col, Row } from 'antd';
const { Paragraph, Title } = Typography;
import ProfileContext from '../../Util/FormContext';
import EditableBasicInfo from '../../Forms/EditableBasicInfo/EditableBasicInfo';

const BasicInfoTab = () => {
	const [basicOpen, setBasicOpen] = useState(false);
	const contextValue = useContext(ProfileContext);
	const { profile, hasProfile } = contextValue;
	const { basicInfo } = profile;
	const address = basicInfo?.address;

	const getFullNumber = (prefix, number) => {
		const areaCode = number.slice(0, 3);
		const firstHalf = number.slice(3, 6);
		const secondHalf = number.slice(6);
		return `${prefix} (${areaCode}) ${firstHalf} - ${secondHalf}`;
	};

	return (
		<div>
			{!hasProfile || basicOpen ? (
				<EditableBasicInfo setBasicOpen={setBasicOpen} />
			) : (
				<>
					<Row>
						<Col span={9}>
							<div style={{ marginBottom: 20 }}>
								<Button
									type='primary'
									style={{
										fontSize: '14px',
										width: '60px',
										height: '30px',
									}}
									onClick={() => setBasicOpen(true)}
								>
									Edit
								</Button>
							</div>
							<div style={{ marginBottom: 20 }}>
								<Title level={5} style={{ fontSize: '16px', color: '#6a6a6a' }}>
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
							<div style={{ marginBottom: 20 }}>
								<Title level={5} style={{ fontSize: '16px', color: '#6a6a6a' }}>
									Email
								</Title>
								<Paragraph style={{ color: '#363636' }}>
									{basicInfo.email}
								</Paragraph>
							</div>
							<div style={{ marginBottom: 20 }}>
								<Title level={5} style={{ fontSize: '16px', color: '#6a6a6a' }}>
									Phone
								</Title>
								<Paragraph style={{ color: '#363636' }}>
									{getFullNumber(basicInfo.phonePrefix, basicInfo.phone)}
								</Paragraph>
							</div>
						</Col>
						<Col span={9} style={{ marginTop: 50 }}>
							{basicInfo.businessPhone ? (
								<div style={{ marginBottom: 20 }}>
									<Title
										level={5}
										style={{ fontSize: '16px', color: '#6a6a6a' }}
									>
										Business Phone
									</Title>
									<Paragraph style={{ color: '#363636' }}>
										{getFullNumber(
											basicInfo.businessPhonePrefix,
											basicInfo.businessPhone
										)}
									</Paragraph>
								</div>
							) : (
								''
							)}
							<div style={{ marginBottom: 20 }}>
								<Title level={5} style={{ fontSize: '16px', color: '#6a6a6a' }}>
									Highest Level of Education
								</Title>
								<Paragraph style={{ color: '#363636' }}>
									{basicInfo.highestLevelEducation}
								</Paragraph>
							</div>
							<div style={{ marginBottom: 20 }}>
								<Title level={5} style={{ fontSize: '16px', color: '#6a6a6a' }}>
									US Citizenship
								</Title>
								<Paragraph style={{ color: '#363636' }}>
									{basicInfo.isUsCitizen == '1' ? 'Yes' : 'No'}
								</Paragraph>
							</div>
						</Col>
					</Row>
				</>
			)}
		</div>
	);
};
export default BasicInfoTab;
