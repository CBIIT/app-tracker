import { Route, Switch } from 'react-router-dom';

import './App.less';
import { hot } from 'react-hot-loader';
import Layout from './hoc/Layout/Layout';
import Home from './containers/Home/Home';
import CreateVacancy from './containers/CreateVacancy/CreateVacancy';
import VacancyDashboard from './containers/VacancyDashboard/VacancyDashboard';
import ViewVacancyDetails from './containers/ViewVacancyDetails/ViewVacancyDetails';
import RegisterOkta from './containers/RegisterOkta/RegisterOkta';
import Apply from './containers/Apply/Apply';

const app = () => {
	return (
		<>
			<Layout>
				<Switch>
					<Route path='/create-vacancy' component={CreateVacancy} />
					<Route path='/vacancy-dashboard' exact component={VacancyDashboard} />
					<Route path='/vacancy/:sysId' component={ViewVacancyDetails} />
					<Route path='/register-okta' component={RegisterOkta} />
					<Route path='/apply' component={Apply} />
					<Route path='/' exact component={Home} />
				</Switch>
			</Layout>
		</>
	);
};

export default hot(module)(app);
