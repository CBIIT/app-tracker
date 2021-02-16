import React from "react";
import { hot } from "react-hot-loader/root";
import "./App.css";
import logo from "./assets/logo.svg";
import img1 from "./assets/img1.png";
import img2 from "./assets/img2.png";
import img3 from "./assets/img3.png";
import { Table, Space, Button, Divider, PageHeader, Tabs, Radio } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

function App() {
  const columns = [
    {
      title: "Vacancy Title",
      dataIndex: "title",
    },
    {
      title: "Open Date",
      dataIndex: "odate",
      sorter: {
        compare: (a, b) => {
          new Date(a.odate) - new Date(b.odate);
        },
        multiple: 1,
      },
    },
    {
      title: "Close Date",
      dataIndex: "cdate",
      sorter: {
        compare: (a, b) => a.math - b.math,
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

  const dataSource = [
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

  const someNumber = dataSource.length;
  return (
    <>
      <div style={{ backgroundColor: "#EDF1F4" }}>
        <PageHeader
          title="Vacancy Dashboard"
          breadcrumb={{ routes }}
          style={{ marginLeft: "220px", display: "inline-block" }}
        />
        <Button
          type="primary"
          style={{
            display: "inline-block",
            backgroundColor: "#015EA2",
            marginLeft: "800px",
            width: "161px",
            height: "36px",
            fontSize: "16px",
          }}
        >
          + Create Vacancy
        </Button>
        <div className="app-container">
          <Tabs>
            <Tabs.TabPane tab={someNumber + " Pre-flight Vacancies"} key="1">
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
                dataSource={dataSource}
                columns={columns}
                onChange={onChange}
                style={{ width: "1170px", display: "block" }}
              ></Table>
            </Tabs.TabPane>
            <Tabs.TabPane tab={"5 Live Vacancies"} key="2"></Tabs.TabPane>
            <Tabs.TabPane tab="18 Closed Vacancies" key="3"></Tabs.TabPane>
          </Tabs>
        </div>
      </div>
      <div className="footer">
        <div>built with love for ServiceNow community</div>
        <div>
          <img src={img1} alt="image1" />
        </div>
        <div>
          <img src={img2} alt="image2" />
        </div>
        <div>
          <img src={img3} alt="image3" />
        </div>
      </div>
    </>
  );
}

export default hot(App);
