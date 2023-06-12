import './EditableBasicInfo.css';
import EditableField from '../../../../components/UI/EditableField/EditableField';
import EditableRadio from '../../../../components/UI/EditableRadio/EditableRadio'
import EditableDropDown from '../../../../components/UI/EditableDropDown/EditableDropDown';
import { SAVE_PROFILE } from '../../../../constants/ApiEndpoints';
import {
	Button,
	Form,
	Input,
	Col,
	Row,
	Select,
} from 'antd';
const { Option } = Select;
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import ProfileContext from '../../Util/FormContext';
import { convertDataToBackend } from '../../Util/ConvertDataToBackend';

import * as XLSX from 'xlsx';
//import {excelToJson } from 'convert-excel-to-json';
import { UploadOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd';
import { Upload } from 'antd';

const editableBasicInfo = ({ setBasicOpen }) => {
	const [formInstance] = Form.useForm();
	const contextValue = useContext(ProfileContext);
	const { profile, hasProfile, setHasProfile } = contextValue;
	const { setCurrentProfileInstance, setProfile } = contextValue;
	useEffect(() => {
		setCurrentProfileInstance(formInstance);
	}, []);

	const phonePrefixSelector = (
		<Form.Item name='phonePrefix' noStyle>
			<Select
				style={{
					width: 70,
				}}
			>
				<Option value='+1'>+1</Option>
				<Option value='+86'>+86</Option>
				<Option value='+87'>+87</Option>
			</Select>
		</Form.Item>
	);

	const businessPhonePrefixSelector = (
		<Form.Item name='businessPhonePrefix' noStyle>
			<Select
				style={{
					width: 70,
				}}
			>
				<Option value='+1'>+1</Option>
				<Option value='+86'>+86</Option>
				<Option value='+87'>+87</Option>
			</Select>
		</Form.Item>
	);

	const onSave = async (values) => {

		var valid = false;

		try {
			await formInstance.validateFields();
			window.scrollTo(0, 0);
			valid = true;
		} catch (error) {
			console.log(error);
		}

		if (valid){
			let data = {
				...profile, 
				basicInfo: values
			}
			setProfile(data);
			var convertedData = convertDataToBackend(data);
			await axios.post(SAVE_PROFILE, convertedData);
			setHasProfile(true);
			setBasicOpen(false);
		}
	};

	const [workbook, setWorkbook] = React.useState(XLSX.utils.book_new());

	const testExcel = async (inboundFile) => {
		console.log(inboundFile);

		console.log('readin the thing.');

		//const file = event.target.files[0];
//		const file = inboundFile.fileList[0];
//		var reader = new FileReader();
	
//		reader.readAsArrayBuffer(file);
//		reader.onload = function (e) {
//		reader.onload = (e: any) => {
	
		  // upload file
	//	  const binarystr = new Uint8Array(e.target.result);
		  const wb = XLSX.readFile(inboundFile.fileList[0].name, { type: 'array', raw: true, cellFormula: false });
		  //const wb = XLSX.read(binarystr, { type: 'array', raw: true, cellFormula: false });
		  //const wb = XLSX.WorkBook = XLSX.read(binarystr, { type: 'array', raw: true, cellFormula: false });
		  console.log(wb.Sheets)
	
		  const wsname = wb.SheetNames[0];
		  const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);
		  console.log(data)
//		}

		/* fetch and parse workbook -- see the fetch example for details */
		//setWorkbook(XLSX.read(await (await fetch("sheetjs.xlsx")).arrayBuffer()));
		//setWorkbook(XLSX.read(await (await fetch(file.name)).arrayBuffer()));		fetch tries to get from HTTP request but its a local file
		//setWorkbook(XLSX.read(await (await file.name)));		// no .arrayBuffer cannot read properties of undefined (reading 'slice')
		// MLH: need an example to read from user input

		//var reader = new FileReader();
		// console.log('got file reader');
        // reader.readAsArrayBuffer(file);
		// console.log('read file bugger');

		//console.log('read buffer');
		//var data = new Uint8Array(reader.result);
		//console.log('got data');
		//var workbook = XLSX.read(file);
		//var workbook = XLSX.readFile(file.name);
		// var workbook = XLSX.read(file, {type: 'raw', raw: true});
		// console.log(workbook);
		// console.log('Made it to the happy side of friday');
		// //var workbook = XLSX.read(data, {type: 'array'});
		// var sheet = workbook.Sheets[workbook.SheetNames[0]];

		// reader.onload = function (e) {
		// 	console.log('read buffer');
        //     var data = new Uint8Array(reader.result);
		// 	console.log('got data');
		// 	var workbook = XLSX.read(file, {type: 'array'});
        //     //var workbook = XLSX.read(data, {type: 'array'});
        //     var sheet = workbook.Sheets[workbook.SheetNames[0]];

		// 	console.log('set the workbook');

		// 	var jsa = XLSX.utils.sheet_to_json(worksheet, opts);
	
		// 	console.log('heres the JSA:');
		// 	console.log(jsa);
		// }



		// const result = excelToJson({
		// 	sourceFile: file.name
		// 	//sourceFile: 'SOME-EXCEL-FILE.xlsx'
		// });
		//console.log(result);
//		alert('alerted');
	}

	const educationMenu = [
		{ label: 'Bachelors', value: 'Bachelors' },
		{ label: 'Masters', value: 'Masters' },
		{ label: 'Doctorate', value: 'Doctorate' },
	];
	const yesNoMenu = [
		{ label: 'Yes', value: 1 },
		{ label: 'No', value: 0 },
	];

	return (
		<Form
			name='basic'
			labelCol={{ span: 24 }}
			wrapperCol={{ span: 24 }}
			style={{ maxWidth: 800, marginLeft: 50, marginRight: 50 }}
			form={formInstance}
			initialValues={profile?.basicInfo}
			onFinish={onSave}
			autoComplete='off'
		>
			<Row>
				<h3>Basic Information</h3>
			</Row>
			<Row>
			<p>{"Let's start with some basic questions. You'll have a chance to review everything before submitting."}</p>
			</Row>
			<Row>
				<Col span={6}>
					<EditableField
						label='First Name'
						name='firstName'
						required={true}
						namesize='18'
					/>
				</Col>
				<Col span={3}> </Col>
				<Col span={6}>
					<EditableField
						label='Middle Name'
						name='middleName'
						required={false}
						size='18'
					/>
				</Col>
				<Col span={3}> </Col>
				<Col span={6}>
					<EditableField
						label='Last Name'
						name='lastName'
						required={true}
						size='18'
					/>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<EditableField label='Email' name='email' required={true} size='18' />
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<Form.Item
						label='Phone'
						name='phone'
						rules={[{ required: false, message: 'Please provide an answer.' }]}
					>
						<Input
							type='tel'
							addonBefore={phonePrefixSelector}
							placeholder='(123) 456-7890'
							maxLength={16}
							name = "phone"
						/>
					</Form.Item>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<Form.Item
						label='Business Phone'
						name='businessPhone'
						rules={[{ required: false, message: 'Please provide an answer.' }]}
					>
						<Input
							type='tel'
							addonBefore={businessPhonePrefixSelector}
							placeholder='(123) 456-7890'
							maxLength={16}
							name='businessPhone'
						/>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12}>
					<EditableDropDown
						label='Highest Level of Education'
						name='highestLevelEducation'
						required={true}
						menu={educationMenu}
					/>
				</Col>
				<Col span={4}> </Col>
				<Col span={8}>
					<EditableRadio
						label='Are you a US citizen?'
						name='isUsCitizen'
						required={true}
						options={yesNoMenu}
					/>
				</Col>
			</Row>
			<Row>
				<h3>Address</h3>
			</Row>
			<Row>
				<p>Please provide your mailing address.</p>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField
						label='Address'
						name={['address', 'address']}
						required={true}
						size='55'
					/>
				</Col>
				<Col span={4}/>
				<Col span={10}>
					<EditableField
						label='Apartment Number or Suite'
						name={['address', 'address2']}
						required={false}
						size='55'
					/>
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField
						label='City'
						name={['address', 'city']}
						required={true}
						size='18'
					/>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField
						label='State/Province'
						name={['address', 'stateProvince']}
						required={true}
						size='18'
					/>
				</Col>
			</Row>
			<Row>
				<Col span={10}>
					<EditableField
						label='Country'
						name={['address', 'country']}
						required={true}
						size='18'
					/>
				</Col>
				<Col span={4}> </Col>
				<Col span={10}>
					<EditableField
						label='Zip/Postal Code'
						name={['address', 'zip']}
						required={true}
						size='18'
					/>
				</Col>
			</Row>
			<Row>
				{!hasProfile ? (
					<></>
				) : (
					<>
						<Col span={6}>
							<Button
								className='wider-button'
								onClick={() => setBasicOpen(false)}
							>
								Cancel
							</Button>
						</Col>
						<Col span={12}></Col>
					</>
				)}
				<Col span={6}>
					<Button className='wider-button' type='primary' htmlType='submit'>
						Save
					</Button>
				</Col>
			</Row>
			<Row>
				<br/>
				Here's a POC for the excel thing:
			</Row>
			<Row>
				<Upload onChange={(file) => testExcel(file)}>
					<Button icon={<UploadOutlined />}>Click to Upload</Button>
				</Upload>
				{/* <input type="file"
					id="avatar" name="avatar"
					accept="image/png, image/jpeg"
					onClick={() => testExcel()}
					></input> */}
			</Row>
			{/* <Row>
				<Button className='wider-button' onClick={() => testExcel()}>
						Here we go !
				</Button>
			</Row> */}
		</Form>
	);
};

export default editableBasicInfo;
