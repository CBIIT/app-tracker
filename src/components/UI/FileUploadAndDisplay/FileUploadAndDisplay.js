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
	afterUploadSuccess,
	uploadSuccessMessage
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
		message.info('Uploading...', 0);
		await axios.post(url, file, options);
		onSuccess(null, file);
		afterUploadSuccess();
		message.destroy();
		message.success(uploadSuccessMessage);
	} catch (error) {
		message.destroy();
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
	deleteUrl,
	deleteSuccessMessage
) => {
	confirm({
		title: deleteConfirmTitle,
		icon: <ExclamationCircleOutlined />,
		content: deleteConfirmText,
		onOk() {
			onDeleteConfirm(onDeleteSuccess, deleteUrl, deleteSuccessMessage);
		},
		onCancel() {},
	});
};

const onDeleteConfirm = async (
	onDeleteSuccess,
	deleteUrl,
	deleteSuccessMessage
) => {
	try {
		message.info('Deleting...', 0);
		await axios.delete(deleteUrl);
		message.destroy();
		message.success(deleteSuccessMessage);
		onDeleteSuccess();
	} catch (error) {
		console.log('Error:', error);
		message.destroy();
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
							props.deleteUrl,
							props.deleteSuccessMessage
						)
					}
					icon={<DeleteOutlined />}
				></Button>
			</>
		) : (
			<Upload
				maxCount={1}
				showUploadList={false}
				customRequest={({ file, onSuccess, onError, onProgress }) =>
					uploadFile(
						{ file, onSuccess, onError, onProgress },
						props.sysId,
						props.url,
						props.table,
						props.afterUploadSuccess,
						props.uploadSuccessMessage
					)
				}
			>
				<Button icon={<UploadOutlined />}>{props.buttonText}</Button>
			</Upload>
		)}
	</>
);

export default fileUploadAndDisplay;
