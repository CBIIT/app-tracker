import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Tabs, Radio, Space, Divider } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  FieldTimeOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import "./VacancyDashboard.css";
import axios from "axios";

const vacancyDashboard = () => {
  // const vacancyTable = (
  //   <Table
  //     dataSource={}
  //     columns={}
  //     style={{
  //       width: "1170px",
  //       display: "block",
  //       paddingLeft: "20px",
  //       paddingRight: "20px",
  //     }}
  //   ></Table>
  // );

  const [preFlightVacancies, setPreFlightVancacies] = useState([]);

  let preFlightCount = [];
  let count = [];

  const preFlightUrl =
    "/api/x_g_nci_app_tracke/vacancy/get_vacancy_list/preflight";

  // const getData = () =>
  //   useEffect(async (url) => {
  //     await axios.get(url).then((res) => {
  //       console.log(res.data);
  //       useState(res.data);
  //     });
  //   }, []);

  // const getData = (url, setFunct, count, vacancies) => {
  //   try {
  //     let result = useEffect(async () => {
  //       await axios.get(url).then((res) => {
  //         console.log(res);
  //         setFunct(res.data);
  //       });
  //     }, []);
  //     // debugger;
  //     count = vacancies.result.length;
  //     vacancies.result.map((i) => {
  //       i.key = i.sys_id;
  //     });
  //     return result;
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  try {
    useEffect(async () => {
      await axios.get(preFlightUrl).then((res) => {
        console.log(res);
        setPreFlightVancacies(res.data);
      });
    }, []);

    preFlightCount = preFlightVacancies.result.length;
    preFlightVacancies.result.map((i) => {
      i.key = i.sys_id;
    });
  } catch (err) {
    console.warn(err);
  }

  const [closedVacancies, setClosedVacancies] = useState([]);
  let closedCount = [];
  const closedUrl = "/api/x_g_nci_app_tracke/vacancy/get_vacancy_list/closed";

  try {
    useEffect(async () => {
      await axios.get(closedUrl).then((res) => {
        console.log(res);
        setClosedVacancies(res.data);
      });
    }, []);

    closedCount = closedVacancies.result.length;
    closedVacancies.result.map((i) => {
      i.key = i.sys_id;
    });
  } catch (err) {
    console.warn(err);
  }

  return (
    <>
      <div style={{ backgroundColor: "#EDF1F4" }}>
        {/* <PageHeader
        breadcrumb={{ routes }}
        style={{ marginLeft: "220px", display: "inline-block" }}
      /> */}
        <div className="app-container" style={{ width: "1170px" }}>
          <Link to="/create-vacancy">
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
              link
            >
              + Create Vacancy
            </Button>
          </Link>
          <Tabs size={"large"}>
            <Tabs.TabPane
              tab={
                <span className="tab-letters">
                  <p className="num-count">{preFlightCount}</p>
                  <p className="vacancy-desc">pre-flight vacancies</p>
                </span>
              }
              key="1"
            >
              <div className="tabs-div">
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
              <div style={{ backgroundColor: "white" }}>
                <Table
                  dataSource={preFlightVacancies.result}
                  columns={preFlightColumns}
                  // onChange={onChange}
                  style={{
                    width: "1170px",
                    display: "block",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                ></Table>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span className="tab-letters">
                  <p className="num-count">{liveCount}</p>
                  <p className="vacancy-desc">live vacancies</p>
                </span>
              }
              key="2"
            >
              <div className="tabs-div">
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
              <div style={{ backgroundColor: "white" }}>
                <Table
                  dataSource={liveData}
                  columns={liveColumns}
                  // onChange={onChange}
                  style={{
                    width: "1170px",
                    display: "block",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                ></Table>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span className="tab-letters">
                  <p className="num-count">{closedCount}</p>
                  <p className="vacancy-desc">closed vacancies</p>
                </span>
              }
              key="3"
            >
              <div className="tabs-div">
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
              <div style={{ backgroundColor: "white" }}>
                <Table
                  dataSource={closedVacancies.result}
                  columns={closedColumns}
                  // onChange={onChange}
                  style={{
                    width: "1170px",
                    display: "block",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                ></Table>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

// Preflight Columns
const preFlightColumns = [
  {
    title: "Vacancy Title",
    dataIndex: "title",
  },
  {
    title: "Open Date",
    dataIndex: "open_date",
    sorter: {
      compare: (a, b) => new Date(a.open_date) - new Date(b.open_date),
      multiple: 1,
    },
  },
  {
    title: "Close Date",
    dataIndex: "close_date",
    sorter: {
      compare: (a, b) => new Date(a.close_date) - new Date(b.close_date),
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
          <MinusCircleOutlined /> close
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
    title: "Close Date",
    dataIndex: "close_date",
    sorter: {
      compare: (a, b) => new Date(a.close_date) - new Date(b.close_date),
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

//  [
//   {
//     key: "1",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "4",
//     odate: "01/12/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "2",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "4",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "3",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "6",
//     odate: "01/12/2021",
//     cdate: "08/14/2021",
//   },
//   {
//     key: "4",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "9",
//     odate: "01/12/2021",
//     cdate: "8/14/2021",
//   },
//   {
//     key: "5",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "4",
//     odate: "01/13/2021",
//     cdate: "8/20/2021",
//   },
//   {
//     key: "6",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "6",
//     odate: "01/12/2021",
//     cdate: "8/14/2021",
//   },
//   {
//     key: "7",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "4",
//     odate: "01/12/2021",
//     cdate: "8/14/2021",
//   },
//   {
//     key: "8",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "4",
//     odate: "01/12/2021",
//     cdate: "8/14/2021",
//   },
//   {
//     key: "9",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "4",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "10",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "2",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "11",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "4",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "12",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "4",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "13",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "1",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "14",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "4",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "15",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "7",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "16",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "4",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "17",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "2",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
//   {
//     key: "18",
//     title: "Director, Division of Cancer Control and Population Sciences",
//     applicants: "3",
//     odate: "01/18/2021",
//     cdate: "06/12/2021",
//   },
// ];

// function onChange(pagination, filters, sorter, extra) {
//   console.log("params", pagination, filters, sorter, extra);
// }

// const routes = [
//   {
//     path: "index",
//     breadcrumbName: "Home",
//   },
//   {
//     path: "first",
//     breadcrumbName: "Vacancy Dashboard",
//   },
// ];

const liveCount = liveData.length;

export default vacancyDashboard;
