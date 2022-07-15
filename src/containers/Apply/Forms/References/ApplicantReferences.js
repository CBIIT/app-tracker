import { useContext, useEffect } from 'react';
import { Form, Input, Collapse, Select } from 'antd';

import FormContext from '../../Context';
import { displayReferenceContactQuestion } from '../../../../components/Util/Application/Application';

import './ApplicantReferences.css';

const { Panel } = Collapse;
const { Option } = Select;

const applicantReferences = (props) => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(FormContext);
	const { formData } = contextValue;

	useEffect(() => {
		const { setCurrentFormInstance } = contextValue;
		setCurrentFormInstance(formInstance);
	}, []);
	return (
		<Form
			form={formInstance}
			initialValues={formData}
			requiredMark={false}
			layout='vertical'
		>
			<Form.List name='references'>
				{(fields) => {
					let panelKeys = fields.map((field) => field.key);
					return (
						<Collapse
							defaultActiveKey={panelKeys}
							className='ApplicantReferencesCollapse'
						>
							{fields.map((field, index) => (
								<Panel key={field.key} header={'Reference ' + (index + 1)}>
									<div className='names' key={field.key + 'namesDiv'}>
										<Form.Item
											name={[index, 'firstName']}
											key={field.key + 'firstName'}
											label='First Name'
											colon={false}
											labelAlign='left'
											rules={[
												{
													required: true,
													message: 'Please enter first name',
												},
											]}
										>
											<Input
												placeholder='Please Enter'
												key={field.key + 'firstNameInput'}
											/>
										</Form.Item>
										<Form.Item
											name={[index, 'middleName']}
											key={field.key + 'middleName'}
											label='Middle Name'
											labelAlign='left'
											colon={false}
										>
											<Input
												placeholder='Please Enter'
												key={field.key + 'middleNameInput'}
											/>
										</Form.Item>
										<Form.Item
											name={[index, 'lastName']}
											key={field.key + 'lastName'}
											label='Last Name'
											labelAlign='left'
											colon={false}
											rules={[
												{
													required: true,
													message: 'Please enter last name',
												},
											]}
										>
											<Input
												placeholder='Please Enter'
												key={field.key + 'lastNameInput'}
											/>
										</Form.Item>
									</div>
									<div
										className='emailPhoneDiv'
										key={field.key + 'emailPhoneDiv'}
									>
										<Form.Item
											name={[index, 'email']}
											key={field.key + 'email'}
											label='Email Address'
											labelAlign='left'
											colon={false}
											rules={[
												{
													type: 'email',
													required: true,
													message: 'Please enter a valid email address',
												},
											]}
										>
											<Input
												type='email'
												placeholder='Please Enter'
												key={field.key + 'emailInput'}
											/>
										</Form.Item>
										<Form.Item
											name={[index, 'phoneNumber']}
											key={field.key + 'phone'}
											label='Phone Number'
											labelAlign='left'
											colon={false}
										>
											<Input
												type='tel'
												placeholder='(123) 456-7890'
												key={field.key + 'phoneInput'}
											/>
										</Form.Item>
									</div>
									<div className='relationshipTitleDiv'>
										<Form.Item
											name={[index, 'relationship']}
											key={field.key + 'relationship'}
											label='Relationship'
											labelAlign='left'
											colon={false}
										>
											<Select placeholder='Please Select'>
												<Option value='Supervisor/Manager'>
													Supervisor/Manager
												</Option>
												<Option value='Co-worker'>Co-worker</Option>
												<Option value='Colleague'>Colleague</Option>
												<Option value='Peer'>Peer</Option>
											</Select>
										</Form.Item>
										<Form.Item
											name={[index, 'title']}
											key={field.key + 'title'}
											label='Position Title (If Applicable)'
											labelAlign='left'
											colon={false}
										>
											<Input
												placeholder='Please Enter'
												key={field.key + 'titleInput'}
											/>
										</Form.Item>
									</div>
									<div>
										<Form.Item
											name={[index, 'organization']}
											key={field.key + 'organization'}
											label='Organization'
											labelAlign='left'
											colon={false}
										>
											<Input
												placeholder='Please Enter'
												key={field.key + 'organizationInput'}
											/>
										</Form.Item>
									</div>
									{displayReferenceContactQuestion(props.vacancyTenantType) ? (
										<div>
											<Form.Item
												name={[index, 'contact']}
												key={field.key + 'contact'}
												label='Is it okay for the Hiring Team to contact the reference
											directly?'
												labelAlign='left'
												colon={false}
												rules={[
													{
														required: true,
														message: 'Please select an answer',
													},
												]}
											>
												<Select placeholder='Please Select'>
													<Option value='yes'>Yes</Option>
													<Option value='no'>No</Option>
												</Select>
											</Form.Item>
										</div>
									) : (
										<></>
									)}
								</Panel>
							))}
						</Collapse>
					);
				}}
			</Form.List>
		</Form>
	);
};

export default applicantReferences;
