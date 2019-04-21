import './css/index.css';
import 'react-github-button/assets/style.css';
import ReactDOM from 'react-dom';
import React from 'react';
import TableContainer from './js/components/container/TableContainer';
import SubredditContainer from './js/components/container/SubredditContainer';
import GlobalContainer from './js/components/container/GlobalContainer';
import {
  Switch,
  Route,
  withRouter,
  BrowserRouter as Router
} from 'react-router-dom';
import withAnalytics, { initAnalytics } from 'react-with-analytics';

initAnalytics(GA_KEY);

const Root = () => (
  <Switch>
    <Route exact path="/" component={TableContainer} />
    <Route path="/Compare" component={GlobalContainer} />
    <Route path="/:subreddit" component={SubredditContainer} />
  </Switch>
);

const AppWithRouter = withRouter(withAnalytics(Root));

class App extends React.Component {
  render() {
    return (
      <Router>
        <AppWithRouter />
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
