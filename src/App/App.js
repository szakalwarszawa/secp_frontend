import React from 'react';
import {Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {history} from '../_helpers';
import './App.css';
import {PrivateRoute} from '../_components';
import {Home} from '../Pages/Home';
import {Login} from '../Pages/Login';

class App extends React.Component {
    render() {
        // const { alert } = this.props;
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="col-sm-8 col-sm-offset-2">
                        <Router history={history}>
                            <div>
                                <PrivateRoute exact path="/" component={Home}/>
                                <Route path="/login" component={Login} />
                                {/*<Route path="/register" component={RegisterPage} />*/}
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export {connectedApp as App};
