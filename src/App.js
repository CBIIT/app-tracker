import { Route, Switch } from 'react-router-dom';

import './App.less';
import { hot } from 'react-hot-loader';
import Layout from './hoc/Layout/Layout';
import Home from './containers/Home/Home';
import CreateVacancy from './containers/CreateVacancy/CreateVacancy';
import VacancyDashboard from './containers/VacancyDashboard/VacancyDashboard';
<<<<<<< HEAD
import ViewVacancyDetails from './containers/ViewVacancyDetails/ViewVacancyDetails';
import RegisterOkta from './containers/RegisterOkta/RegisterOkta';
import Apply from './containers/Apply/Apply';

const app = () => {
=======

function App() {
>>>>>>> origin/dev
	return (
		<>
			<Layout>
				<Switch>
<<<<<<< HEAD
					<Route path='/create-vacancy' component={CreateVacancy} />
					<Route path='/vacancy-dashboard' exact component={VacancyDashboard} />
					<Route path='/vacancy/:sysId' component={ViewVacancyDetails} />
					<Route path='/register-okta' component={RegisterOkta} />
					<Route path='/apply' component={Apply} />
					<Route path='/' exact component={Home} />
=======
					<Route path='/' exact component={Home} />
					<Route path='/create-vacancy' component={CreateVacancy} />
					<Route path='/vacancy-dashboard' exact component={VacancyDashboard} />
>>>>>>> origin/dev
				</Switch>
			</Layout>
		</>
	);
<<<<<<< HEAD
};

export default hot(module)(app);
=======
}

// if (module.hot) {
// 	module.hot.accept();
// }

export default hot(module)(App);
>>>>>>> origin/dev
