import m, { FactoryComponent } from 'mithril';
import { Collection, FlatButton } from 'mithril-materialized';
import { Form, LayoutForm } from 'mithril-ui-form';
import { IActions, IAppModel } from '../../services/meiosis';

const EditUser: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => ({
  view: ({ attrs: { state, actions } }) => {
    const { saveUser } = actions;
    const user = state.users.current || {};
    return m(
      '.row',
      m(LayoutForm, {
        form: [
          {
            id: 'username',
            label: 'User name',
            type: 'text',
            required: true,
            className: 'col s12',
          },
          {
            id: 'first',
            label: 'First name',
            type: 'text',
            required: true,
            className: 'col s6',
          },
          {
            id: 'last',
            label: 'Last name',
            type: 'text',
            required: true,
            className: 'col s6',
          },
        ] as Form,
        obj: user,
        onchange: () => saveUser(user),
      })
    );
  },
});

export const UserPage: FactoryComponent<{
  actions: IActions;
  state: IAppModel;
}> = () => {
  return {
    oninit: async ({ attrs: { actions } }) => actions.getUsers(),
    view: ({ attrs: { state, actions } }) => {
      const { all: users = [], current: user } = state.users || {};
      return m('.row', [
        m('.col.s12.m4.l3.show-icon-on-hover', [
          m(Collection, {
            header: 'Users',
            items: users.map(u => ({
              id: u.$loki,
              title: u.username || '',
              iconName: 'edit',
              onclick: () => actions.setCurrentUser(u),
            })),
          }),
          m(FlatButton, {
            style: 'float: right',
            iconName: 'add',
            onclick: () => actions.setCurrentUser({}),
          }),
        ]),
        user &&
          m('.col.s12.m8.l9', { style: 'margin-top: 1.35em;' }, [
            m('h4', `Edit user '${user.username}'`),
            m(EditUser, { state, actions }),
            m(FlatButton, {
              style: 'float: right',
              iconName: 'delete',
              iconClass: 'red-text',
              onclick: () => actions.deleteUser(user),
            }),
          ]),
      ]);
    },
  };
};
