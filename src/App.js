import { Route, Switch } from 'react-router-dom';

import './App.less';
import { hot } from 'react-hot-loader';
import Layout from './hoc/Layout/Layout';
import Home from './containers/Home/Home';
import CreateVacancy from './containers/CreateVacancy/CreateVacancy';
import VacancyDashboard from './containers/VacancyDashboard/VacancyDashboard';
import ViewVacancyDetails from './containers/ViewVacancyDetails/ViewVacancyDetails';

function App() {
	return (
		<>
			<Layout>
				<Switch>
					<Route path='/create-vacancy' component={CreateVacancy} />
					<Route path='/vacancy-dashboard' exact component={VacancyDashboard} />
					<Route path='/vacancy/:sysId' component={ViewVacancyDetails} />
					<Route path='/' exact component={Home} />
				</Switch>
			</Layout>
		</>
	);
}

export default hot(module)(App);
