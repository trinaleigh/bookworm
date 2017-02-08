'use strict';

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import Library from './components/Library';
import Explorer from './components/Explorer';
import NotFound from './components/NotFound';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={Library}/>
    <Route path="explorer" component={Explorer}/>
    <Route path="*" component={NotFound}/>
  </Route>
);

export default routes;