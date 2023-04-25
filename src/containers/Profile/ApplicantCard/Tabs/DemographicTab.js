import { useState, useContext } from 'react';
import { Typography } from 'antd';
const { Paragraph, Title } = Typography;

import ProfileContext from '../../Util/FormContext';
import DemographicsForm from '../../Forms/Demographics';
const DemographicTab = () => {

	const contextValue = useContext(ProfileContext);
	const { profile, hasProfile } = contextValue;
	const [demoOpen, setDemoOpen] = useState(false);

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

    const getDisability = (value) => {
			switch (value) {
				case 'Deaf':
					return 'Deaf or serious difficulty hearing';
				case 'Blind':
					return 'Blind or serious difficulty seeing even when wearing glasses';
				case 'Amputee':
					return 'Missing an arm, leg, hand or foot';
				case 'Paralysis':
					return 'Paralysis: partial or complete paralysis (any cause)';
				case 'Disfigurement':
					return 'Significant disfigurement: for example, severe disfigurements caused by burns, wounds, accidents or congenital disorders';
				case 'Mobility Impairment':
					return 'Significant mobility impairment: for example, uses a wheelchair, scooter, walker or uses a leg brace to walk';
				case 'Psychiatric Disorder':
					return 'Significant psychiatric disorder: for example, bipolar disorder, schizophrenia, PTSD or major depression';
				case 'Intellectual Disability':
					return 'Intellectual disability (formerly described as mental retardation)';
				case 'Developmental Disability':
					return 'Developmental disability: for example, cerebral palsy or autism spectrum disorder';
				case 'Brain Injury':
					return 'Traumatic brain injury';
				case 'Dwarfism':
					return 'Dwarfism';
				case 'Epilepsy':
					return 'Epilepsy';
				case 'Other Disability':
					return 'Other disability or serious health condition: for example, diabetes, cancer, cardiovascular disease, anxiety disorder or HIV infection';
				case 'None':
					return 'None of the conditions listed above apply to me.';
				case 'Do Not Wish to Answer':
					return 'I do not wish to answer questions regarding my disability/health conditions.';
			}
		};

    const getRace = (value) => {
        switch (value) {
            case 'American Indian':
                return "American Indian or Alaska Native";
            case 'Asian':
                return 'Asian';
            case 'African-American':
                return "Black or African-American";
            case 'Pacific Islander':
                return "Native Hawaiian or other Pacific Islander"
            case 'White':
                return 'White';
        }
    }

	const { demographics } = profile;

	return !hasProfile || demoOpen || !demographics.share ? (
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
				<span style={{ fontSize: '14px', marginLeft: '5px' }}>(optional)</span>
			</Title>
			<div>
				<a onClick={() => setDemoOpen(true)}>Edit</a>
			</div>
			{demographics.share === '0' ? (
				<Paragraph>You've chosen not to share your demographics.</Paragraph>
			) : (
				<>
					<div>
						<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
							Sex
						</Title>
						<Paragraph style={{ color: '#363636' }}>
							{demographics.sex}
						</Paragraph>
					</div>
					<div>
						<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
							{' '}
							Ethnicity{' '}
						</Title>
						<Paragraph style={{ color: '#363636' }}>
							{getEthnicity(demographics.ethnicity)}
						</Paragraph>
					</div>
					<div>
						<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
							{' '}
							Race{' '}
						</Title>
						{demographics?.race.map((element) => (
							<Paragraph style={{ color: '#363636' }} key={element}>
								{getRace(element)}
							</Paragraph>
						))}
					</div>
					<Title level={5} style={{ fontSize: '14px', color: '#6a6a6a' }}>
						{' '}
						Disabilities/Serious Health Condition{' '}
					</Title>
					{demographics?.disability.map((condition) => (
						<Paragraph style={{ color: '#363636' }} key={condition}>
							{getDisability(condition)}
						</Paragraph>
					))}
				</>
			)}
		</div>
	);
};

export default DemographicTab;