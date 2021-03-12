import { Route, Switch } from 'react-router-dom';

import './App.less';
import { hot } from 'react-hot-loader';
import Layout from './hoc/Layout/Layout';
import Home from './containers/Home/Home';
import CreateVacancy from './containers/CreateVacancy/CreateVacancy';
import VacancyDashboard from './containers/VacancyDashboard/VacancyDashboard';
import ApplicantForm from './containers/Applicant/Forms/BasicInfo/ApplicantBasicInfo';

function App() {
	return (
		<>
			<Layout>
				<Switch>
					<Route path='/' exact component={Home} />
					<Route path='/create-vacancy' component={CreateVacancy} />
					<Route path='/vacancy-dashboard' exact component={VacancyDashboard} />
					<Route path='/applicant-form' exact component={ApplicantForm} />
				</Switch>
			</Layout>
		</>
	);
}

// if (module.hot) {
// 	module.hot.accept();
// }

export default hot(module)(App);
