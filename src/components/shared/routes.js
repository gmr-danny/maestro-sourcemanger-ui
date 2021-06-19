  
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Overview from '../pages/overview';
import SourceSetup from '../pages/sourcesetup';


const AllRoutes = () => {
	return (
		<Switch>
            <Route exact path = '/' component = { Overview } />
            <Route exact path = '/SourceSetup/:id' component = { SourceSetup } />
        </Switch>
		)
};

export default AllRoutes;
