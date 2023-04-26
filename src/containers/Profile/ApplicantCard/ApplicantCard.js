import { useState, useContext } from 'react';
import { Avatar, Card, Typography } from 'antd';
const { Title } = Typography;

import ProfileContext from '../Util/FormContext';
import DemographicTab from './Tabs/DemographicTab';
import BasicInfoTab from './Tabs/BasicInfoTab';

const tabList = [
	{
		key: 'basicInfo',
		tab: 'Basic Information'
	},
	{
		key: 'demographics',
		tab: 'Demographics'
	}
];

const contentObject = {
	basicInfo: <BasicInfoTab />,
	demographics: <DemographicTab />
}

const ApplicantCard = () => {
	const [activeTab, setActiveTab] = useState('basicInfo');

	const getFirstInitial = (first) => {
		const firstName = first.split('');
		return firstName[0];
	};

	const getLastInitial = (last) => {
		const lastName = last.split('');
		return lastName[0];
	};

	const tabChange = (key) => {
		setActiveTab(key);
	};

	const contextValue = useContext(ProfileContext);
	const { profile } = contextValue;

	const { basicInfo } = profile;

	return (
		<Card
			style={{ width: '100%', height: '100%' }}
			tabList={tabList}
			activeTabKey={activeTab}
			onTabChange={tabChange}
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
			{contentObject[activeTab]}
		</Card>
	);
};

export default ApplicantCard;
