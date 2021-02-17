import React from "react";
import { Table, PageHeader, Button, Tabs, Radio, Space, Divider } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  FieldTimeOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";

const vacancyDashboard = () => (
  <>
    <div style={{ backgroundColor: "#EDF1F4" }}>
      {/* <PageHeader
        breadcrumb={{ routes }}
        style={{ marginLeft: "220px", display: "inline-block" }}
      /> */}
      <div className="app-container" style={{ width: "1170px" }}>
        <Button
          type="primary"
          style={{
            display: "inline-block",
            backgroundColor: "#015EA2",
            marginLeft: "1010px",
            width: "161px",
            height: "36px",
            fontSize: "16px",
          }}
        >
          + Create Vacancy
        </Button>
        <Tabs>
          <Tabs.TabPane tab={preFlightCount + " Pre-flight Vacancies"} key="1">
            <div style={{ backgroundColor: "white", padding: "10px" }}>
              <p style={{ display: "inline-block" }}>Filter Vacancies: </p>
              <Radio.Group
                defaultValue="all"
                style={{ display: "inline-block", paddingLeft: "10px" }}
              >
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="draft">Draft</Radio.Button>
                <Radio.Button value="final">Finalized</Radio.Button>
              </Radio.Group>
            </div>
            <Table
              dataSource={preFlightData}
              columns={preFlightColumns}
              onChange={onChange}
              style={{ width: "1170px", display: "block" }}
            ></Table>
          </Tabs.TabPane>
          <Tabs.TabPane tab={liveCount + " Live Vacancies"} key="2">
            <div
              style={{
                backgroundColor: "white",
                padding: "10px",
                width: "1170px",
              }}
            >
              <p style={{ display: "inline-block" }}>Filter Vacancies: </p>
              <Radio.Group
                defaultValue="all"
                style={{ display: "inline-block", paddingLeft: "10px" }}
              >
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="live">Live</Radio.Button>
                <Radio.Button value="extended">Extended</Radio.Button>
              </Radio.Group>
            </div>
            <Table
              dataSource={liveData}
              columns={liveColumns}
              onChange={onChange}
              style={{ width: "1170px", display: "block" }}
            ></Table>
          </Tabs.TabPane>
          <Tabs.TabPane tab={closedCount + " Closed Vacancies"} key="3">
            <div
              style={{
                backgroundColor: "white",
                padding: "10px",
                width: "1170px",
              }}
            >
              <p style={{ display: "inline-block" }}>Filter Vacancies: </p>
              <Radio.Group
                defaultValue="all"
                style={{ display: "inline-block", paddingLeft: "10px" }}
              >
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="closed">Closed</Radio.Button>
                <Radio.Button value="triaged">Triaged</Radio.Button>
                <Radio.Button value="individuallyscored">
                  Individually Scored
                </Radio.Button>
                <Radio.Button value="scored">Scored</Radio.Button>
                <Radio.Button value="archived">Archived</Radio.Button>
              </Radio.Group>
            </div>
            <Table
              dataSource={closedData}
              columns={closedColumns}
              onChange={onChange}
              style={{ width: "1170px", display: "block" }}
            ></Table>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  </>
);

// Preflight Columns
const preFlightColumns = [
  {
    title: "Vacancy Title",
    dataIndex: "title",
  },
  {
    title: "Open Date",
    dataIndex: "odate",
    sorter: {
      compare: (a, b) => new Date(a.odate) - new Date(b.odate),
      multiple: 1,
    },
  },
  {
    title: "Close Date",
    dataIndex: "cdate",
    sorter: {
      compare: (a, b) => new Date(a.cdate) - new Date(b.cdate),
      multiple: 2,
    },
  },
  {
    title: "Actions",
    key: "action",
    render: () => (
      <Space size="middle">
        <Button type="text">
          <EditOutlined /> edit
        </Button>
        <Divider type="vertical" />
        <Button type="text">
          <DeleteOutlined /> remove
        </Button>
      </Space>
    ),
  },
];

const preFlightData = [
  {
    key: "1",
    title: "Director, Division of Cancer Control and Population Sciences",
    odate: "01/12/2021",
    cdate: "06/12/2021",
  },
  {
    key: "2",
    title: "Director, Division of Cancer Control and Population Sciences",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "3",
    title: "Director, Division of Cancer Control and Population Sciences",
    odate: "01/12/2021",
    cdate: "08/14/2021",
  },
  {
    key: "4",
    title: "Director, Division of Cancer Control and Population Sciences",
    odate: "01/12/2021",
    cdate: "8/14/2021",
  },
  {
    key: "5",
    title: "Director, Division of Cancer Control and Population Sciences",
    odate: "01/13/2021",
    cdate: "8/20/2021",
  },
  {
    key: "6",
    title: "Director, Division of Cancer Control and Population Sciences",
    odate: "01/12/2021",
    cdate: "8/14/2021",
  },
  {
    key: "7",
    title: "Director, Division of Cancer Control and Population Sciences",
    odate: "01/12/2021",
    cdate: "8/14/2021",
  },
  {
    key: "8",
    title: "Director, Division of Cancer Control and Population Sciences",
    odate: "01/12/2021",
    cdate: "8/14/2021",
  },
];

const liveColumns = [
  {
    title: "Vacancy Title",
    dataIndex: "title",
  },
  {
    title: "Applicants",
    dataIndex: "applicants",
    sorter: {
      compare: (a, b) => a.applicants - b.applicants,
      multiple: 1,
    },
    defaultSortOrder: "ascend",
  },
  {
    title: "Open Date",
    dataIndex: "odate",
    sorter: {
      compare: (a, b) => {
        new Date(a.odate) - new Date(b.odate);
      },
      multiple: 2,
    },
  },
  {
    title: "Close Date",
    dataIndex: "cdate",
    sorter: {
      compare: (a, b) => new Date(a.cdate) - new Date(b.cdate),
      multiple: 3,
    },
  },
  {
    title: "Actions",
    key: "action",
    width: "5px",
    render: () => (
      <Space size={0}>
        <Button type="text" style={{ padding: "0px" }}>
          <EditOutlined /> edit
        </Button>
        <Divider type="vertical" />
        <Button type="text" style={{ padding: "0px" }}>
          <LinkOutlined /> copy link
        </Button>
        <Divider type="vertical" />
        <Button type="text" style={{ padding: "0px" }}>
          <FieldTimeOutlined /> extend
        </Button>
        <Divider type="vertical" />
        <Button type="text" style={{ padding: "0px" }}>
          <CloseSquareOutlined /> close
        </Button>
      </Space>
    ),
  },
];

const liveData = [
  {
    key: "1",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/12/2021",
    cdate: "06/12/2021",
  },
  {
    key: "2",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "3  ",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "3",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "6",
    odate: "01/12/2021",
    cdate: "08/14/2021",
  },
  {
    key: "4",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "9",
    odate: "01/12/2021",
    cdate: "8/14/2021",
  },
  {
    key: "5",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "2",
    odate: "01/13/2021",
    cdate: "8/20/2021",
  },
];

const closedColumns = [
  {
    title: "Vacancy Title",
    dataIndex: "title",
  },
  {
    title: "Applicants",
    dataIndex: "applicants",
    sorter: {
      compare: (a, b) => a.applicants - b.applicants,
      multiple: 1,
    },
    defaultSortOrder: "ascend",
  },
  {
    title: "Open Date",
    dataIndex: "odate",
    sorter: {
      compare: (a, b) => {
        new Date(a.odate) - new Date(b.odate);
      },
      multiple: 2,
    },
  },
  {
    title: "Close Date",
    dataIndex: "cdate",
    sorter: {
      compare: (a, b) => new Date(a.cdate) - new Date(b.cdate),
      multiple: 3,
    },
  },
  {
    title: "Actions",
    key: "action",
    render: () => (
      <Space size="middle">
        <Button type="text">
          <EditOutlined /> edit
        </Button>
        <Divider type="vertical" />
        <Button type="text">
          <DeleteOutlined /> remove
        </Button>
      </Space>
    ),
  },
];

const closedData = [
  {
    key: "1",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/12/2021",
    cdate: "06/12/2021",
  },
  {
    key: "2",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "3",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "6",
    odate: "01/12/2021",
    cdate: "08/14/2021",
  },
  {
    key: "4",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "9",
    odate: "01/12/2021",
    cdate: "8/14/2021",
  },
  {
    key: "5",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/13/2021",
    cdate: "8/20/2021",
  },
  {
    key: "6",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "6",
    odate: "01/12/2021",
    cdate: "8/14/2021",
  },
  {
    key: "7",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/12/2021",
    cdate: "8/14/2021",
  },
  {
    key: "8",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/12/2021",
    cdate: "8/14/2021",
  },
  {
    key: "9",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "10",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "2",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "11",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "12",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "13",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "1",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "14",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "15",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "7",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "16",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "4",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "17",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "2",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
  {
    key: "18",
    title: "Director, Division of Cancer Control and Population Sciences",
    applicants: "3",
    odate: "01/18/2021",
    cdate: "06/12/2021",
  },
];

function onChange(pagination, filters, sorter, extra) {
  console.log("params", pagination, filters, sorter, extra);
}

const routes = [
  {
    path: "index",
    breadcrumbName: "Home",
  },
  {
    path: "first",
    breadcrumbName: "Vacancy Dashboard",
  },
];

const preFlightCount = preFlightData.length;
const liveCount = liveData.length;
const closedCount = closedData.length;

export default vacancyDashboard;
