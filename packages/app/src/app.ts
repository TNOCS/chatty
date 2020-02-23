/** During development, use this URL to access the server. */
export const apiServer = () => process.env.SERVER || window.location.origin; // `http://localhost:${process.env.LOKI_PORT}/`;

import 'material-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';
import m from 'mithril';
import { init } from '../../api/src';
import './css/style.css';
import { dashboardSvc } from './services/router-service';
export const chattyService = init(apiServer() + '/api', m.request);

m.route(document.body, dashboardSvc.defaultRoute, dashboardSvc.routingTable());
