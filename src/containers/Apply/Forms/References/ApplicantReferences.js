import { Form, Input, Button, Collapse, Col } from 'antd';
import './ApplicantReferences.css';

const { Panel } = Collapse;

const references = { referencesTemplate: [{}, {}, {}] };

const applicantReferences = (props) => {
	// const references = props.references
	return (
		<div className='form-container'>
			<div className='collapse-div'>
				<Form initialValues={references} requiredMark={false}>
					<Form.List name='referencesTemplate'>
						{(fields, { add, remove }) => {
							return (
								<div>
									<Collapse defaultActiveKey={'0'} accordion>
										{fields.map((field, index) => (
											<>
												<Panel
													header={'Reference ' + (index + 1)}
													key={field.key}
												>
													<div className='names'>
														<Form.Item
															name={[index, 'firstName']}
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
																key={field.key}
															/>
														</Form.Item>
														<Form.Item
															name={[index, 'middleName']}
															label='Middle Name'
															labelAlign='left'
															colon={false}
														>
															<Input
																placeholder='Please Enter'
																key={field.key}
															/>
														</Form.Item>
														<Form.Item
															name={[index, 'lastName']}
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
																key={field.key}
															/>
														</Form.Item>
													</div>
													<div className='emailPhoneDiv'>
														<Form.Item
															name={[index, 'email']}
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
																key={field.key}
															/>
														</Form.Item>
														<Form.Item
															name={[index, 'phoneNumber']}
															label='Phone Number'
															labelAlign='left'
															colon={false}
															rules={[
																{
																	required: true,
																	message: 'Please enter a valid phone number',
																},
															]}
														>
															<Input
																type='tel'
																placeholder='(123) 456-7890'
																key={field.key}
															/>
														</Form.Item>
													</div>
												</Panel>

												{/* <Button
												type='primary'
												onClick={() => {
													debugger;
													remove();
												}}
											>
												remove
											</Button> */}
											</>
										))}
									</Collapse>
									<Button
										type='secondary'
										onClick={() => {
											add();
											console.log('clicked');
										}}
									>
										add more
									</Button>
								</div>
							);
						}}
					</Form.List>
					{/* <Panel header='Reference 1' key='1'>
							<Form
								layout='vertical'
								name='References'
								className='referencesForm'
							>
								<div className='names'>
									<Form.Item
										name={['user', 'name', 'first']}
										label='First Name'
										rules={[
											{
												required: true,
												message: 'Please enter first name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'middle']}
										label='Middle Name'
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'last']}
										label='Last Name'
										rules={[
											{
												required: true,
												message: 'Please enter last name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
								</div>
								<div className='emailPhoneDiv'>
									<Form.Item
										name={['user', 'email']}
										label='Email Address'
										rules={[
											{
												type: 'email',
												required: true,
												message: 'Please enter a valid email address',
											},
										]}
									>
										<Input type='email' placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'phone-number']}
										label='Phone Number'
										rules={[
											{
												required: true,
												message: 'Please enter a valid phone number',
											},
										]}
									>
										<Input type='tel' placeholder='(123) 456-7890' />
									</Form.Item>
								</div>
							</Form>
						</Panel> */}
					{/* <Panel header='Reference 2' key='2'>
							<Form
								layout='vertical'
								name='References'
								className='referencesForm'
							>
								<div className='names'>
									<Form.Item
										name={['user', 'name', 'first']}
										label='First Name'
										rules={[
											{
												required: true,
												message: 'Please enter first name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'middle']}
										label='Middle Name'
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'last']}
										label='Last Name'
										rules={[
											{
												required: true,
												message: 'Please enter last name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
								</div>
								<div className='emailPhoneDiv'>
									<Form.Item
										name={['user', 'email']}
										label='Email Address'
										rules={[
											{
												type: 'email',
												required: true,
												message: 'Please enter a valid email address',
											},
										]}
									>
										<Input type='email' placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'phone-number']}
										label='Phone Number'
										rules={[
											{
												required: true,
												message: 'Please enter a valid phone number',
											},
										]}
									>
										<Input type='tel' placeholder='(123) 456-7890' />
									</Form.Item>
								</div>
							</Form>
						</Panel>
						<Panel header='Reference 3' key='3'>
							<Form
								layout='vertical'
								name='References'
								className='referencesForm'
							>
								<div className='names'>
									<Form.Item
										name={['user', 'name', 'first']}
										label='First Name'
										rules={[
											{
												required: true,
												message: 'Please enter first name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'middle']}
										label='Middle Name'
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'name', 'last']}
										label='Last Name'
										rules={[
											{
												required: true,
												message: 'Please enter last name',
											},
										]}
									>
										<Input placeholder='Please Enter' />
									</Form.Item>
								</div>
								<div className='emailPhoneDiv'>
									<Form.Item
										name={['user', 'email']}
										label='Email Address'
										rules={[
											{
												type: 'email',
												required: true,
												message: 'Please enter a valid email address',
											},
										]}
									>
										<Input type='email' placeholder='Please Enter' />
									</Form.Item>
									<Form.Item
										name={['user', 'phone-number']}
										label='Phone Number'
										rules={[
											{
												required: true,
												message: 'Please enter a valid phone number',
											},
										]}
									>
										<Input type='tel' placeholder='(123) 456-7890' />
									</Form.Item>
								</div>
							</Form>
						</Panel> */}
				</Form>
			</div>
		</div>
	);
};

export default applicantReferences;
