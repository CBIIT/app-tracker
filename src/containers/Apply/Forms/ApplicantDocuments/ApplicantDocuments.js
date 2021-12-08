import FormContext from '../../Context';
import { useState, useEffect, useContext } from 'react';
import { Form, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './ApplicantDocuments.css';

const ApplicantDocuments = () => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(FormContext);
	const { formData } = contextValue;
	const [applicantDocuments, setApplicantDocuments] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		const { setCurrentFormInstance } = contextValue;
		setCurrentFormInstance(formInstance);
		setApplicantDocuments(formData.applicantDocuments);
		setIsLoading(false);
	}, []);

	const uploadProps = {
		beforeUpload: (file) => {
			if (file.size / 1024 / 1024 > 1000) {
				message.error('Document should be less than 1 GB.');
				return Upload.LIST_IGNORE;
			}
			return false; // Prevents immediate upload.
		},
		accept: '.docx, .pdf, .doc',
		maxCount: 1,
		multiple: false,
	};

	const onRemove = (file, index) => {
		const fileIndex = applicantDocuments[index].file.fileList.indexOf(file);

		const newFileList = applicantDocuments[index].file.fileList.slice();
		newFileList.splice(fileIndex, 1);
		let newApplicantDocuments = applicantDocuments.slice();

		newApplicantDocuments[index] = {
			...newApplicantDocuments[index],
			file: { ...newApplicantDocuments[index].file, fileList: newFileList },
		};

		setApplicantDocuments(newApplicantDocuments);
	};

	const onChange = () => {
		setApplicantDocuments(formInstance.getFieldValue('applicantDocuments'));
	};

	const validateFile = async (fileList, isOptional) => {
		if (fileList.length === 0 && +isOptional !== 1)
			throw new Error('Please upload a document.');
	};

	return !isLoading && applicantDocuments && applicantDocuments.length !== 0 ? (
		<Form form={formInstance} initialValues={formData} onChange={onChange}>
			<div className='upload-documents'>
				<Form.List name='applicantDocuments'>
					{(fields) => {
						return (
							<div>
								{fields.map((field, index) => (
									<div key={field.key}>
										<div className='document-title'>
											{formInstance.getFieldValue([
												'applicantDocuments',
												index,
												'title',
												'value',
											])}
											{applicantDocuments[index].is_optional.value == '1'
												? ' (optional)'
												: ''}
										</div>
										<div className='UploadRow'>
											<Form.Item
												name={[index, 'file']}
												valuePropName={[index, 'file']}
												rules={[
													{
														validator: () =>
															validateFile(
																applicantDocuments[index].file.fileList,
																applicantDocuments[index].is_optional.value
															),
													},
												]}
											>
												<Upload
													fileList={applicantDocuments[index].file.fileList}
													{...uploadProps}
													onRemove={(file) => onRemove(file, index)}
												>
													<Button
														disabled={
															applicantDocuments[index].file.fileList.length >=
															1
														}
													>
														<UploadOutlined /> Upload
													</Button>
												</Upload>
											</Form.Item>
											<div className='doc-types'>
												allowed: .doc, .docx, .pdf
											</div>
										</div>
									</div>
								))}
							</div>
						);
					}}
				</Form.List>
			</div>
		</Form>
	) : null;
};
export default ApplicantDocuments;
