import React from "react";
import { Route, Switch } from "react-router-dom";
import "antd/dist/antd.css";

import "./App.css";
import Layout from "./hoc/Layout/Layout";
import Home from "./containers/Home/Home";
import CreateVacancy from "./containers/CreateVacancy/CreateVacancy";

function App() {
  return (
    <>
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/create-vacancy" component={CreateVacancy} />
        </Switch>
      </Layout>
    </>
  );
}

export default App;
