import { useContext } from 'react';
import { Table } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

import { displayReferenceContactQuestion } from '../../../../components/Util/Application/Application';
import FormContext from '../../Context';
import SectionHeader from '../../../../components/UI/ReviewSectionHeader/ReviewSectionHeader';
import LabelValuePair from '../../../../components/UI/LabelValuePair/LabelValuePair';

import './Review.css';

const review = (props) => {
	const contextValue = useContext(FormContext);
	const { formData } = contextValue;

	const referencesColumns = [
		{
			title: 'Name',
			render: (record) => {
				return <span>{record.firstName + ' ' + record.lastName}</span>;
			},
		},
		{ title: 'Email', dataIndex: 'email' },
		{ title: 'Phone', dataIndex: 'phoneNumber' },
		{ title: 'Relationship', dataIndex: 'relationship' },
		{ title: 'Title', dataIndex: 'title' },
		{ title: 'Organization', dataIndex: 'organization' },
	];

	if (displayReferenceContactQuestion(props.vacancyTenantType))
		referencesColumns.push({
			title: 'Contact',
			render: (record) => {
				return (
					<span>
						{record.contact[0].toUpperCase() + record.contact.slice(1)}
					</span>
				);
			},
		});

	const references = formData.references.map((reference, index) => ({
		key: index,
		...reference,
	}));

	const getAllRaces = (value) => {
		if (!value)
			return '';
		for(var i = 0; i < value.length; i++)
			value[i] = getRace(value[i]);
		return value.join(', ');
	}

	const getAllDisabilities = (value) => {
		if (!value)
			return '';
		for(var i = 0; i < value.length; i++)
			value[i] = getDisability(value[i]);
		return value.join(', ');
	}

	const getEthnicity = (value) => {
		if (!value)
			return '';
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
		if (!value)
			return 'Prefer not to answer';
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

	return (
		<div>
			<SectionHeader
				title='Basic Information'
				onClick={() => props.onEditButtonClick('basicInfo')}
				showButton='false'
			/>
			<div className='SectionContent'>
				<div className='SectionContentRow'>
					<LabelValuePair
						label='First Name'
						value={formData.basicInfo.firstName}
					/>
					<LabelValuePair
						label='Middle Name'
						value={formData.basicInfo.middleName}
					/>
					<LabelValuePair
						label='Last Name'
						value={formData.basicInfo.lastName}
					/>
				</div>
				<div className='SectionContentRow'>
					<LabelValuePair
						label='Email Address'
						value={formData.basicInfo.email}
					/>
				</div>
				<div className='SectionContentRow'>
					<LabelValuePair
						label='Phone'
						value={
							formData.basicInfo.phone
								? formData.basicInfo.phonePrefix.toString() +
								  formData.basicInfo.phone.toString()
								: ''
						}
					/>
					<LabelValuePair
						label='Business Phone'
						value={
							formData.basicInfo.businessPhone
								? formData.basicInfo.businessPhonePrefix.toString() +
								  formData.basicInfo.businessPhone.toString()
								: ''
						}
					/>
				</div>
				<div className='SectionContentRow'>
					<LabelValuePair
						containerStyle={{ width: '100%', maxWidth: '320px' }}
						label='Highest Level of Education'
						value={formData.basicInfo.highestLevelEducation}
					/>
					<LabelValuePair
						label='Are you a US citizen?'
						value={formData.basicInfo.isUsCitizen === '1' ? 'Yes' : 'No'}
					/>
				</div>
			</div>
			<SectionHeader
				title='Address'
				onClick={() => props.onEditButtonClick('address')}
				showButton='false'
			/>
			<div className='SectionContent'>
				<div className='SectionContentRow'>
					<LabelValuePair
						label='Address Line 1'
						value={formData.address.address}
					/>
					<LabelValuePair
						label='Address Line 2'
						value={formData.address.address2 === undefined ? formData.address.address2 : ""}
					/>
				</div>
				<div className='SectionContentRow'>
					<LabelValuePair label='City' value={formData.address.city} />
					<LabelValuePair
						label='State'
						value={formData.address.stateProvince}
					/>
					<LabelValuePair label='Post Code' value={formData.address.zip} />
				</div>
			</div>
			<SectionHeader
				title='Demographics'
				onClick={() => props.onEditButtonClick('demographics')}
				showButton='false'
			/>
			<div className='SectionContent'>
				<div className='SectionContentRow'>
					<LabelValuePair
						label='Sharing demographics'
						value={formData?.questions?.share != "0" ? "Yes" : "No" }
					/>
					<LabelValuePair
						label='Sex'
						value={ formData?.questions?.sex ? formData?.questions?.sex : "Prefer not to answer"}
					/>
					<LabelValuePair
						label='Ethnicity'
						value={formData?.questions?.ethnicity ? getEthnicity(formData?.questions?.ethnicity) : "Prefer not to answer"}
					/>
					<LabelValuePair
						label='Race'
						value={getAllRaces(formData?.questions?.race)}
					/>
					<LabelValuePair
						label='Disability'
						value={getAllDisabilities(formData?.questions?.disability)}
					/>
				</div>
			</div>
			{formData.references.length > 0 ? (
				<>
					<SectionHeader
						title='References'
						onClick={() => props.onEditButtonClick('references')}
					/>
					<div className='SectionContent'>
						<Table
							key='references'
							pagination={{ hideOnSinglePage: true }}
							locale={{
								emptyText: 'No references.',
							}}
							dataSource={references}
							columns={referencesColumns}
							scroll={{ x: 'true' }}
						/>
					</div>
				</>
			) : null}

			{formData.applicantDocuments.length > 0 ? (
				<>
					<SectionHeader
						title='Application Documents'
						onClick={() => props.onEditButtonClick('applicantDocuments')}
					/>
					<div className='SectionContent'>
						{formData.applicantDocuments.map((document, index) => (
							<div key={index}>
								{document.uploadedDocument &&
								document.uploadedDocument.markedToDelete === false ? (
									<>
										{'✓ '}
										{document.title.value}
										{
											<div className='FileListRow' key={index}>
												<FileTextOutlined />{' '}
												{document.uploadedDocument.fileName}
											</div>
										}
									</>
								) : (
									<>
										{document.file.fileList.length > 0 ? '✓ ' : '× '}
										{document.title.value}
										{document.file.fileList.map((file, index) => (
											<div className='FileListRow' key={index}>
												<FileTextOutlined /> {file.name}
											</div>
										))}
									</>
								)}
							</div>
						))}
					</div>
				</>
			) : null}
		</div>
	);
};

export default review;
