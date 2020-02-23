import m, { FactoryComponent } from 'mithril';
import { Icon } from 'mithril-materialized';
import logo from '../assets/chat_logo.svg';
import { IDashboard } from '../models/dashboard';
import { IActions, IAppModel } from '../services';
import { dashboardSvc } from '../services/router-service';

const stripRouteParams = (path: string) => path.replace(/:[a-zA-Z]+/, '');

const isActiveRoute = (route = m.route.get()) => (path: string) =>
  path.length > 1 && route.indexOf(stripRouteParams(path)) >= 0
    ? '.active'
    : '';

export const Layout: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let initialized = false;
  let isInitializing = false;

  const initDropdown = () => {
    const dropdowns = document.getElementsByClassName('dropdown-trigger');
    if (dropdowns) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < dropdowns.length; i++) {
        M.Dropdown.init(dropdowns[i], { autoTrigger: true, hover: true });
      }
    }
  };

  return {
    view: ({ children, attrs: { state, actions } }) => {
      if (!isInitializing && (!state.users || !state.users.all)) {
        isInitializing = true;
        actions.getUsers();
      }
      const isActive = isActiveRoute();
      const users = state.users?.all || [];
      if (!initialized && users.length > 0) {
        initialized = true;
        initDropdown();
      }
      const userLabel =
        state.users?.current?.username?.toUpperCase() ||
        m(Icon, { iconName: 'person', iconClass: 'large' });
      return m('.main', [
        m(
          'ul.dropdown-content[id=selectuser]',
          users.map(u =>
            m(
              'li',
              m('div',
                {
                  style: 'cursor:pointer; text-transform:uppercase; margin: 5px 10px;',
                  onclick: (e: UIEvent) => {
                    e.preventDefault();
                    actions.setCurrentUser(u);
                    // (e as any).redraw = false;
                  },
                },
                u.username
              )
            )
          )
        ),
        m(
          '.navbar-fixed',
          { style: 'z-index: 1001' },
          m(
            'nav',
            m('.nav-wrapper', [
              m('a.brand-logo[href=#]', [
                m(`img[width=45][height=45][src=${logo}]`, {
                  style: 'margin: 7px 0 0 5px;',
                }),
                m(
                  'div',
                  {
                    style:
                      'margin-top: 0px; position: absolute; top: 16px; left: 1  0px; width: 400px;',
                  },
                  m(
                    'h4.center.hide-on-med-and-down',
                    {
                      style:
                        'text-align: left; margin: -7px 0 0 60px; background: #01689B',
                    },
                    'Chatty service'
                  )
                ),
              ]),
              m(
                // 'a.sidenav-trigger[href=#!/home][data-target=slide-out]',
                // { onclick: (e: UIEvent) => e.preventDefault() },
                m.route.Link,
                {
                  className: 'sidenav-trigger',
                  'data-target': 'slide-out',
                  href: m.route.get(),
                },
                m(Icon, {
                  iconName: 'menu',
                  className: '.hide-on-med-and-up',
                  style: 'margin-left: 5px;',
                })
              ),
              m('ul.right', [
                ...dashboardSvc
                  .getList()
                  .filter(d => d.visible || isActive(d.route))
                  .map((d: IDashboard) =>
                    m(
                      `li${isActive(d.route)}`,
                      m(
                        m.route.Link,
                        { href: d.route },
                        m(
                          'span',
                          d.icon
                            ? m(
                                'i.material-icons.white-text',
                                typeof d.icon === 'string' ? d.icon : d.icon()
                              )
                            : d.title
                        )
                      )
                    )
                  ),
                m(
                  'li',
                  m(
                    'a.white-text.dropdown-trigger[href=#!][data-target=selectuser]',
                    [
                      userLabel,
                      m(Icon, {
                        iconName: 'arrow_drop_down',
                        className: 'right',
                      }),
                    ]
                  )
                ),
              ]),
            ])
          )
        ),
        m('.container', children),
      ]);
    },
  };
};
