import m, { ComponentTypes, RouteDefs } from 'mithril';
import { actions, IActions, IAppModel, states } from '.';
import { AboutPage } from '../components/about/about-page';
import { Layout } from '../components/layout';
import { DashboardPage } from '../components/pages/dashboard-page';
import { RoomPage } from '../components/pages/room-page';
import { UserPage } from '../components/pages/user-page';
import { IDashboard as IRoute } from '../models/dashboard';

export const enum Route {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  HELP = 'HELP',
  // READ = 'SHOW',
  // EDIT = 'EDIT',
  // PLAY = 'PLAY',
  // SEARCH = 'SEARCH',
  USER = 'USER',
  ROOM = 'ROOM',
  DASHBOARD = 'DASHBOARD',
}

class RouterService {
  private actions = actions;
  private states = states;
  private dashboards!: ReadonlyArray<IRoute>;

  constructor(
    private layout: ComponentTypes<{
      state: IAppModel;
      actions: IActions;
    }>,
    dashboards: IRoute[]
  ) {
    this.setList(dashboards);
  }

  public getList() {
    return this.dashboards;
  }

  public setList(list: IRoute[]) {
    this.dashboards = Object.freeze(list);
  }

  public get defaultRoute() {
    const dashboard = this.dashboards.filter(d => d.default).shift();
    return dashboard ? dashboard.route : this.dashboards[0].route;
  }

  public route(dashboardId: Route) {
    const dashboard = this.dashboards.filter(d => d.id === dashboardId).shift();
    return dashboard ? dashboard.route : this.defaultRoute;
  }

  public switchTo(
    dashboardId: Route,
    params?: { [key: string]: string | number | undefined }
  ) {
    const dashboard = this.dashboards.filter(d => d.id === dashboardId).shift();
    if (dashboard) {
      m.route.set(dashboard.route, params ? params : undefined);
    }
  }

  public routingTable() {
    return this.dashboards.reduce((p, c) => {
      p[c.route] =
        c.hasNavBar === false
          ? {
              render: () => {
                // console.log(JSON.stringify(this.states(), null, 2));
                return m(c.component, {
                  state: this.states(),
                  actions: this.actions,
                });
              },
            }
          : {
              render: () => {
                // console.log(JSON.stringify(this.states(), null, 2));
                return m(
                  this.layout,
                  { state: this.states(), actions: this.actions },
                  m(c.component, {
                    state: this.states(),
                    actions: this.actions,
                  })
                );
              },
            };
      return p;
    }, {} as RouteDefs);
  }
}

export const dashboardSvc: RouterService = new RouterService(Layout, [
  {
    id: Route.DASHBOARD,
    title: 'DASHBOARD',
    icon: 'dashboard',
    route: '/',
    visible: true,
    component: DashboardPage,
  },
  {
    id: Route.USER,
    title: 'USERS',
    icon: 'people',
    route: '/users',
    visible: true,
    component: UserPage,
  },
  {
    id: Route.ROOM,
    title: 'ROOMS',
    icon: 'chat',
    route: '/rooms',
    visible: true,
    component: RoomPage,
  },
  // {
  //   id: Dashboards.HELP,
  //   title: 'HELP',
  //   icon: 'info',
  //   route: '/help',
  //   visible: true,
  //   component: HelpPage,
  // },
  {
    id: Route.ABOUT,
    title: 'ABOUT',
    icon: 'help',
    route: '/about',
    visible: true,
    component: AboutPage,
  },
  // {
  //   id: Dashboards.HOME,
  //   default: true,
  //   // hasNavBar: false,
  //   title: 'HOME',
  //   route: '/',
  //   visible: false,
  //   component: HomePage,
  // },
]);
