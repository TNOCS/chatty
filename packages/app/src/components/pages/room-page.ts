import m, { FactoryComponent } from 'mithril';
import { Collection, FlatButton } from 'mithril-materialized';
import { Form, LayoutForm } from 'mithril-ui-form';
import { IRoom } from '../../../../api/src';
import { IActions, IAppModel } from '../../services/meiosis';
import { p } from '../../utils/index';

const EditRoom: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => ({
  view: ({ attrs: { state, actions } }) => {
    const { saveRoom } = actions;
    const users = state.users.all || [];
    const room =
      state.rooms && state.rooms.current ? state.rooms.current : ({} as IRoom);
    return m(
      '.row',
      m(LayoutForm, {
        key: room.$loki,
        form: [
          {
            id: 'name',
            label: 'Room name',
            type: 'text',
            required: true,
          },
          {
            id: 'userIds',
            label: 'Select users',
            type: 'select',
            required: true,
            multiple: true,
            options: users.map(u => ({
              id: u.$loki,
              label: `${u.username} (${p(u.first)}${p(
                u.first && u.last,
                ' '
              )}${p(u.last)})`,
            })),
          },
        ] as Form,
        obj: room,
        onchange: () => {
          console.log(room);
          saveRoom(room);
        },
      })
    );
  },
});

export const RoomPage: FactoryComponent<{
  actions: IActions;
  state: IAppModel;
}> = () => {
  return {
    oninit: async ({ attrs: { actions } }) => {
      actions.getUsers();
      actions.getRooms();
    },
    view: ({ attrs: { state, actions } }) => {
      const { all: rooms = [], current: room } = state.rooms || {};
      return m('.row', [
        m('.col.s12.m4.l3.show-icon-on-hover', [
          m(Collection, {
            header: 'Rooms',
            items: rooms.map(u => ({
              id: u.$loki,
              title: u.name || '',
              iconName: 'edit',
              onclick: () => actions.setCurrentRoom(u),
            })),
          }),
          m(FlatButton, {
            style: 'float: right',
            iconName: 'add',
            onclick: () => actions.setCurrentRoom({} as IRoom),
          }),
        ]),
        room &&
          m('.col.s12.m8.l9', { style: 'margin-top: 1.35em;' }, [
            m('h4', `Edit '${room.name || 'new room'}'`),
            m(EditRoom, { state, actions }),
            m(FlatButton, {
              style: 'float: right',
              iconName: 'delete',
              iconClass: 'red-text',
              onclick: () => actions.deleteUser(room),
            }),
          ]),
      ]);
    },
  };
};
