import { useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, DatePicker, message } from 'antd';
import moment from 'moment';
import axios from 'axios';

import {
	EXTEND_VACANCY,
	DASHBOARD_VACANCIES,
} from '../../../constants/ApiEndpoints';

const extendModal = ({
	extendModalVisible,
	handleExtendModalCancel,
	currentVacancy,
	setData,
	tab,
}) => {
	const [modalLoading, setModalLoading] = useState(false);
	const [extensionDate, setExtensionDate] = useState();

	const datePickerChangeHandler = (date) => {
		setExtensionDate(date);
	};

	const extendVacancy = async () => {
		setModalLoading(true);
		try {
			await axios.post(EXTEND_VACANCY, {
				id: currentVacancy.sys_id,
				extendDate: extensionDate,
			});
			const updatedExtendedData = await axios.get(DASHBOARD_VACANCIES + tab);
			setData(updatedExtendedData.data.result);
			message.success('Vacancy extended');
		} catch (error) {
			message.error('Sorry, an error occurred while trying to extend vacancy');
		}
		handleExtendModalCancel();
		setModalLoading(false);
	};

	const disabledDate = (selected) => {
		const currentCloseDate = moment(currentVacancy.close_date);
		return selected && selected <= currentCloseDate;
	};

	return (
		<Modal
			visible={extendModalVisible}
			onOk={extendVacancy}
			onCancel={handleExtendModalCancel}
			closable={false}
			okText='Confirm'
			okButtonProps={{ disabled: !extensionDate }}
			cancelText='Cancel'
			confirmLoading={modalLoading}
		>
			<div>
				<ExclamationCircleFilled
					style={{
						color: '#faad14',
						fontSize: '24px',
						display: 'inline-block',
						marginRight: '15px',
					}}
				/>
				<h2
					style={{
						display: 'inline-block',
					}}
				>
					Extend Vacancy
				</h2>
				<p>Please select a new close date to extend the vacancy to:</p>
				<DatePicker
					disabledDate={disabledDate}
					defaultValue={moment(currentVacancy.close_date)}
					onChange={datePickerChangeHandler}
					format='MM/DD/YYYY'
				/>
			</div>
		</Modal>
	);
};

export default extendModal;
