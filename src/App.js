import { Route, Switch } from 'react-router-dom';

import './App.less';
import Layout from './hoc/Layout/Layout';
import Home from './containers/Home/Home';
import CreateVacancy from './containers/CreateVacancy/CreateVacancy';
import VacancyDashboard from './containers/VacancyDashboard/VacancyDashboard';

function App() {
	return (
		<>
			<Layout>
				<Switch>
					<Route path='/' exact component={Home} />
					<Route path='/create-vacancy' component={CreateVacancy} />
					<Route path='/vacancy-dashboard' exact component={VacancyDashboard} />
				</Switch>
			</Layout>
		</>
	);
}

export default App;
