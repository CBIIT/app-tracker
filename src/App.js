import React from "react";
import { Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader/root";
import "antd/dist/antd.css";

import "./App.css";
import Layout from "./hoc/Layout/Layout";
import Home from "./Containers/Home/Home";
import VacancyDashboard from "./containers/VacancyDashboard/VacancyDashboard";

function App() {
  return (
    <>
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/vacancy-dashboard" exact component={VacancyDashboard} />
        </Switch>
      </Layout>
    </>
  );
}

export default hot(App);
