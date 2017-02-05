'use strict';

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Library from './components/Library';
import Layout from './components/Layout';
import NotFound from './components/NotFound';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={Library}/>
    <Route path="*" component={NotFound}/>
  </Route>
);

export default routes;