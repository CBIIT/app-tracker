import React from 'react';
import { Table } from 'antd';

import './Home.css';
import homeLogo from '../../assets/images/home-logo.png';

const columns = [
    {
        title: 'Vacancy Title',
        dataIndex: 'vacancyTitle',
        render: title => <a>{title}</a>,
        sorter: (a, b) => a.vacancyTitle.length - b.vacancyTitle.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Application Period',
        dataIndex: 'applicationPeriod',
    },
    {
        title: 'Reviews Begin',
        dataIndex: 'reviewsBegin',
    },
];

const data = [
    {
        key: '1',
        vacancyTitle: 'Director, Division of Population Sciences',
        applicationPeriod: '01/12/2021 - 06/12/2021',
        reviewsBegin: '06/17/2021',
    },
    {
        key: '2',
        vacancyTitle: 'Director, Division of Population Sciences',
        applicationPeriod: '01/12/2021 - 06/12/2021',
        reviewsBegin: '06/17/2021',
    },
    {
        key: '3',
        vacancyTitle: 'Director, Division of Population Sciences',
        applicationPeriod: '01/12/2021 - 06/12/2021',
        reviewsBegin: '06/17/2021',
    },
    {
        key: '4',
        vacancyTitle: 'Director, Division of Population Sciences',
        applicationPeriod: '01/12/2021 - 06/12/2021',
        reviewsBegin: '06/17/2021',
    },
];

function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
}

const home = () => (

    <>
        <div className='HomeLogo'><img src={homeLogo}></img></div>
        <div className='HomeContent'>
            <p>The largest of the institutes and centers that make up the National Institutes of Health, the National Cancer Institute (NCI) is a
            premier research center that offers research, programmatic support, and training opportunities at its laboratories and offices in
            Maryland. NCI is deeply committed to the core values of equity, diversity, and inclusion that allow all staff to reach their potential
                and fully contribute to the Institute’s cancer mission.</p>
            <p>To learn more about NCI, please visit http://www.cancer.gov</p>
            <h2>Open Vacancies</h2>
            <Table columns={columns} dataSource={data} onChange={onChange} />
        </div>
    </>
);

export default home;