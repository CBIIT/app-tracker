import { Route, Switch } from 'react-router-dom';

import './App.less';
import { hot } from 'react-hot-loader';
import Layout from './hoc/Layout/Layout';
import Home from './containers/Home/Home';
import { MANAGE_APPLICATION, MANAGE_VACANCY } from './constants/Routes';
import CreateVacancy from './containers/CreateVacancy/CreateVacancy';
import VacancyDashboard from './containers/VacancyDashboard/VacancyDashboard';
import ViewVacancyDetails from './containers/ViewVacancyDetails/ViewVacancyDetails';
import ManageDashboard from './containers/ManageDashboard/ManageDashboard';
import ChairDashboard from './containers/ChairDashboard/ChairDashboard';
import RegisterOkta from './containers/RegisterOkta/RegisterOkta';
import Apply from './containers/Apply/Apply';
import Application from './containers/Application/Application';

const app = () => {
	return (
		<>
			<Layout>
				<Switch>
					<Route path={MANAGE_APPLICATION + ':sysId'} component={Application} />
					<Route path='/chair-dashboard/:sysId' component={ChairDashboard} />
					<Route path='/create-vacancy' component={CreateVacancy} />
					<Route path='/apply/:sysId' component={Apply} />
					<Route path='/vacancy-dashboard' exact component={VacancyDashboard} />
					<Route path='/vacancy/:sysId' component={ViewVacancyDetails} />
					<Route
						path={MANAGE_VACANCY + ':sysId/:tab?'}
						component={ManageDashboard}
					/>
					<Route path='/register-okta' component={RegisterOkta} />
					<Route path='/' exact component={Home} />
				</Switch>
			</Layout>
		</>
	);
};

export default hot(module)(app);
