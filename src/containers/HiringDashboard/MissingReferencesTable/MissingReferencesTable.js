import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, message } from 'antd';
import axios from 'axios';

import { GET_APPLICANT_LIST, APPLICANT_GET_APPLICATION } from '../../../constants/ApiEndpoints';
import { MANAGE_VACANCY } from '../../../constants/Routes';
import './MissingReferencesTable.css';

// Parse "X out of Y" string returned by the applicant-list API
const parseRefCounts = (str) => {
	if (!str) return { received: 0, total: 0 };
	const match = str.match(/(\d+)\s+out\s+of\s+(\d+)/i);
	if (!match) return { received: 0, total: 0 };
	return { received: parseInt(match[1], 10), total: parseInt(match[2], 10) };
};

const columns = [
	{
		title: 'Vacancy',
		dataIndex: 'vacancyTitle',
		render: (title, record) => (
			<Link to={MANAGE_VACANCY + record.vacancySysId}>{title}</Link>
		),
		sorter: (a, b) => a.vacancyTitle.localeCompare(b.vacancyTitle),
	},
	{
		title: 'Applicant Name',
		dataIndex: 'applicantName',
		sorter: (a, b) => a.applicantName.localeCompare(b.applicantName),
	},
	{
		title: 'Received / Total',
		key: 'receivedTotal',
		render: (_, record) => `${record.received} / ${record.total}`,
		width: 140,
	},
	{
		title: '# Missing',
		dataIndex: 'missing',
		width: 110,
		render: (missing) => <span className='MissingCount'>{missing}</span>,
		sorter: (a, b) => a.missing - b.missing,
		defaultSortOrder: 'descend',
	},
];

// Expanded row: lazily fetches full application to list outstanding references
const ExpandedRow = ({ appSysId }) => {
	const [loading, setLoading] = useState(true);
	const [refs, setRefs] = useState([]);

	useEffect(() => {
		axios
			.get(APPLICANT_GET_APPLICATION + appSysId)
			.then((res) => {
				const raw = res.data.result.references || [];
				const outstanding = raw.filter(
					(r) => r.reference_received !== 'Yes'
				);
				setRefs(outstanding);
			})
			.catch(() => {
				message.error('Sorry! Could not load reference details.');
			})
			.finally(() => {
				setLoading(false);
			});
	}, [appSysId]);

	if (loading) {
		return <div className='MissingRefsLoading'>Loading references…</div>;
	}

	if (refs.length === 0) {
		return <div>No outstanding references found.</div>;
	}

	return (
		<ul className='MissingRefsList'>
			{refs.map((r, i) => (
				<li key={r.ref_sys_id || i}>
					<strong>
						{r.first_name} {r.last_name}
					</strong>{' '}
					— {r.email || '—'}{r.relationship ? ` (${r.relationship})` : ''}
				</li>
			))}
		</ul>
	);
};

const missingReferencesTable = ({ vacancies }) => {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!vacancies || vacancies.length === 0) {
			setRows([]);
			setLoading(false);
			return;
		}

		setLoading(true);

		const perVacancy = vacancies.map((vacancy) =>
			axios
				.get(GET_APPLICANT_LIST + vacancy.sys_id + '?offset=0&limit=1000')
				.then((res) => {
					const applicants = res.data.result.applicants || [];
					return applicants
						.filter((app) => {
							const { received, total } = parseRefCounts(
								app.total_received_references
							);
							return total > 0 && received < total;
						})
						.map((app) => {
							const { received, total } = parseRefCounts(
								app.total_received_references
							);
							return {
								key: app.sys_id,
								vacancySysId: vacancy.sys_id,
								vacancyTitle: vacancy.title,
								applicantName: app.applicant_name,
								appSysId: app.sys_id,
								received,
								total,
								missing: total - received,
							};
						});
				})
				.catch(() => [])
		);

		Promise.all(perVacancy).then((results) => {
			setRows(results.flat());
			setLoading(false);
		});
	}, [vacancies]);

	return (
		<div className='MissingReferencesTable'>
			<Table
				rowKey='key'
				dataSource={rows}
				columns={columns}
				loading={loading}
				pagination={{ hideOnSinglePage: true, pageSize: 10 }}
				scroll={{ x: true }}
				locale={{ emptyText: '✅ All requested references have been received.' }}
				expandable={{
					expandedRowRender: (record) => (
						<ExpandedRow appSysId={record.appSysId} />
					),
				}}
			/>
		</div>
	);
};

export default missingReferencesTable;
