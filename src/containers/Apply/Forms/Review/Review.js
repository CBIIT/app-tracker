import { useContext } from 'react';
import { Table } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

import FormContext from '../../Context';
import SectionHeader from '../../../../components/UI/ReviewSectionHeader/ReviewSectionHeader';
import LabelValuePair from '../../../../components/UI/LabelValuePair/LabelValuePair';

import './Review.css';

const review = (props) => {
	const contextValue = useContext(FormContext);
	const { formData } = contextValue;
	const reviewData = JSON.parse(JSON.stringify(formData));
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

	const references = formData.references.map((reference, index) => ({
		key: index,
		...reference,
	}));

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
						value={reviewData.basicInfo.firstName}
					/>
					<LabelValuePair
						label='Middle Name'
						value={reviewData.basicInfo.middleName}
					/>
					<LabelValuePair
						label='Last Name'
						value={reviewData.basicInfo.lastName}
					/>
				</div>
				<div className='SectionContentRow'>
					<LabelValuePair
						label='Email Address'
						value={reviewData.basicInfo.email}
					/>
				</div>
				<div className='SectionContentRow'>
					<LabelValuePair
						label='Phone'
						value={
							reviewData.basicInfo.phone
								? reviewData.basicInfo.phonePrefix.toString() +
								  reviewData.basicInfo.phone.toString()
								: ''
						}
					/>
					<LabelValuePair
						label='Business Phone'
						value={
							reviewData.basicInfo.businessPhone
								? reviewData.basicInfo.businessPhonePrefix.toString() +
								  reviewData.basicInfo.businessPhone.toString()
								: ''
						}
					/>
				</div>
				<div className='SectionContentRow'>
					<LabelValuePair
						containerStyle={{ width: '100%', maxWidth: '320px' }}
						label='Highest Level of Education'
						value={reviewData.basicInfo.highestLevelEducation}
					/>
					<LabelValuePair
						label='Are you a US citizen?'
						value={reviewData.basicInfo.isUsCitizen === 1 ? 'Yes' : 'No'}
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
						value={reviewData.address.address}
					/>
					<LabelValuePair
						label='Address Line 2'
						value={reviewData.address.address2 !== undefined ? reviewData.address.address2 : ""}
					/>
				</div>
				<div className='SectionContentRow'>
					<LabelValuePair label='City' value={reviewData.address.city} />
					<LabelValuePair
						label='State'
						value={reviewData.address.stateProvince}
					/>
					<LabelValuePair label='Post Code' value={reviewData.address.zip} />
				</div>
			</div>
			{reviewData?.focusArea ?
				<SectionHeader
					title='Focus Area'
					onClick={() => props.onEditButtonClick('applicantDocuments')}
				/>
				: null
			}			
			{reviewData?.focusArea ?
				<div className='SectionContent'>
				{reviewData?.focusArea?.map((area, index) => {
					return (
						<p key={index}>{area}</p>
					);
				})}
				</div>
				: null
			}
			{reviewData.references.length > 0 ? (
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

			{reviewData.applicantDocuments.length > 0 ? (
				<>
					<SectionHeader
						title='Application Documents'
						onClick={() => props.onEditButtonClick('applicantDocuments')}
					/>
					<div className='SectionContent'>
						{reviewData.applicantDocuments.map((document, index) => (
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
										{document.file?.fileList.length > 0 ? '✓ ' : '× '}
										{document.title?.value}
										{document.file?.fileList.map((file, index) => (
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
