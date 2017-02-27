import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Base from './containers/Base/Base';
import Workspace from './containers/Workspace/Workspace';

export const urls = {
  index: '/',
};

export const routes = (
  <Route path={urls.index} component={Base}>
    <IndexRoute component={Workspace} />
  </Route>
);
