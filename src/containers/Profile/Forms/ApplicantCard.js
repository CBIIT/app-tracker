import { useEffect, useState, useContext } from 'react';
import { Avatar, Card, message, Typography, Divider } from 'antd';
const { Paragraph, Title } = Typography;

import ProfileContext from '../Util/FormContext';
import DemographicsForm from './Demographics';
import EditableBasicInfo from '../../EditableBasicInfo/EditableBasicInfo';

const ApplicantCard = () => {
	const [demoOpen, setDemoOpen] = useState(false);
	const [basicOpen, setBasicOpen] = useState(false);

	const contextValue = useContext(ProfileContext);
	const { profile } = contextValue;

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

	const { basicInfo, demographics } = profile;
	const address = basicInfo?.address;

	return (
		<Card
			style={{ width: '100%', height: '100%' }}
			title={
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Avatar
						size={50}
						style={{ backgroundColor: '#15477a', color: 'ffffff' }}
					>
						{getFirstInitial(basicInfo.firstName) +
							getLastInitial(basicInfo.lastName)}
					</Avatar>
					<Title
						level={4}
						style={{
							marginLeft: '10px',
							marginTop: '10px',
							fontSize: '18px',
							color: '#2b2b2b',
						}}
					>
						{basicInfo.firstName} {basicInfo.lastName}
					</Title>
				</div>
			}
		>
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
				{demoOpen ? (
					<DemographicsForm setDemoOpen={setDemoOpen} />
				) : (
					<div>
						<Title
							level={4}
							style={{
								color: '#2b2b2b',
								fontSize: '18px',
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							Demographics{' '}
							<span style={{ fontSize: '14px', marginLeft: '5px' }}>
								(optional)
							</span>
						</Title>
						<div>
							<a onClick={() => setDemoOpen(true)}>Edit</a>
						</div>
						{demographics.share === '0' ? (
							<Paragraph>
								You've chosen not to share your demographics.
							</Paragraph>
						) : (
							<>
								<div>
									<Title
										level={5}
										style={{ fontSize: '14px', color: '#6a6a6a' }}
									>
										Sex
									</Title>
									<Paragraph style={{ color: '#363636' }}>
										{demographics.sex}
									</Paragraph>
								</div>
								<div>
									<Title
										level={5}
										style={{ fontSize: '14px', color: '#6a6a6a' }}
									>
										{' '}
										Ethnicity{' '}
									</Title>
									<Paragraph style={{ color: '#363636' }}>
										{getEthnicity(demographics.ethnicity)}
									</Paragraph>
								</div>
								<div>
									<Title
										level={5}
										style={{ fontSize: '14px', color: '#6a6a6a' }}
									>
										{' '}
										Race{' '}
									</Title>
									{demographics?.race.map((element) => (
										<Paragraph style={{ color: '#363636' }} key={element}>
											{element}
										</Paragraph>
									))}
								</div>
								<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
									{' '}
									Disabilities/Serious Health Condition{' '}
								</Title>
								{demographics?.disability.map((condition) => (
									<Paragraph style={{ color: '#363636' }} key={condition}>
										{condition}
									</Paragraph>
								))}
							</>
						)}
					</div>
				)}
			</div>
		</Card>
	);
};

export default ApplicantCard;
