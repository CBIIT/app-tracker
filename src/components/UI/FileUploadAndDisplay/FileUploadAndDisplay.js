import { Upload, Button, Modal, message } from 'antd';
import {
	UploadOutlined,
	DeleteOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { confirm } = Modal;

const uploadFile = async (
	{ file, onSuccess, onError },
	tableSysId,
	url,
	table,
	afterUploadSuccess
) => {
	const options = {
		params: {
			file_name: file.name,
			table_name: table,
			table_sys_id: tableSysId,
		},
		headers: {
			'Content-Type': file.type,
		},
	};
	try {
		await axios.post(url, file, options);
		onSuccess(null, file);
		afterUploadSuccess();
		message.success('Rating plan updated.');
	} catch (error) {
		message.error(
			'Sorry, an error occurred while uploading.  Try reloading the page and uploading again.'
		);
		onError(error);
	}
};

const onDeleteButtonClick = (
	deleteConfirmTitle,
	deleteConfirmText,
	onDeleteSuccess,
	deleteUrl
) => {
	confirm({
		title: deleteConfirmTitle,
		icon: <ExclamationCircleOutlined />,
		content: deleteConfirmText,
		onOk() {
			onDeleteConfirm(onDeleteSuccess, deleteUrl);
		},
		onCancel() {},
	});
};

const onDeleteConfirm = async (onDeleteSuccess, deleteUrl) => {
	try {
		await axios.delete(deleteUrl);
		message.success('Rating plan deleted.');
		onDeleteSuccess();
	} catch (error) {
		message.error(
			'Sorry, there was an issue deleting.  Try reloading the page and deleting again.'
		);
	}
};

const fileUploadAndDisplay = (props) => (
	<>
		{props.downloadLink ? (
			<>
				<a href={props.downloadLink} style={{ marginRight: '16px' }}>
					{props.fileName}
				</a>
				<Button
					onClick={() =>
						onDeleteButtonClick(
							props.deleteConfirmTitle,
							props.deleteConfirmText,
							props.onDeleteSuccess,
							props.deleteUrl
						)
					}
					icon={<DeleteOutlined />}
				></Button>
			</>
		) : (
			<Upload
				maxCount={1}
				showUploadList={false}
				customRequest={({ file, onSuccess, onError }) =>
					uploadFile(
						{ file, onSuccess, onError },
						props.sysId,
						props.url,
						props.table,
						props.afterUploadSuccess
					)
				}
			>
				<Button icon={<UploadOutlined />}>{props.buttonText}</Button>
			</Upload>
		)}
	</>
);

export default fileUploadAndDisplay;
