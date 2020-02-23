import m, { FactoryComponent } from 'mithril';
import {
  Collection,
  FileInput,
  FlatButton,
  TextInput,
} from 'mithril-materialized';
import { IUser } from '../../../../api/src/models/user';
import { apiServer } from '../../app';
import { IActions, IAppModel } from '../../services';
import { CircularSpinner } from '../ui/preloader';

const uploadUrl = apiServer() + '/upload/';
const upload = (files: FileList, user: IUser) => {
  if (!files || files.length < 1) {
    return console.warn('File is undefined');
  }
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < files.length; i++) {
    const body = new FormData();
    body.append('file', files[i]);
    m.request<string>({
      method: 'POST',
      url: uploadUrl + user.$loki,
      body,
    });
  }
};

export const DashboardPage: FactoryComponent<{
  actions: IActions;
  state: IAppModel;
}> = () => {
  let currentUsername = '';
  let files = undefined as FileList | undefined;

  return {
    view: ({ attrs: { actions, state } }) => {
      const currentUser = state.users?.current;
      if (!currentUser) {
        return m(
          '.row',
          m('.col.s12.center-align', [
            m('p', 'Please select a user!'),
            m(CircularSpinner),
          ])
        );
      }
      if (!currentUsername || currentUser.username !== currentUsername) {
        currentUsername = currentUser.username || '';
        actions.getRoomsOfCurrentUser();
        // return m(CircularSpinner);
      }
      const userRooms = state.rooms?.user || [];
      const currentRoom = state.rooms?.current;
      const msg = state.rooms?.message;
      console.log(JSON.stringify(msg, null, 2));
      const messagesHeader = currentRoom
        ? `${currentRoom.name} messages`
        : 'Messages';
      const msgs = currentRoom?.messages || [];
      return m('.row', [
        m(
          '.col.s12.m4.show-icon-on-hover',
          m(Collection, {
            header: `${
              currentUser.first ? `${currentUser.first}'s rooms` : 'Rooms'
            }`,
            items: userRooms.map(r => ({
              title: r.name,
              iconName: 'rate_review',
              onclick: () => actions.setCurrentRoom(r),
            })),
          })
        ),
        m('.col.s12.m8', [
          m('h4', { style: 'margin-top: 1.2em' }, messagesHeader),
          m(
            'ul',
            msgs.map(message =>
              m(
                'li.message',
                {
                  className:
                    message.ownerId === currentUser.$loki ? 'mine' : 'theirs',
                },
                m('.message-content', [
                  m(
                    'div',
                    message.media &&
                      message.media.map(f => {
                        const isImg = /.jpg$|.jpeg$|.png$|.gif$|.svg$|.bmp$|.tif$|.tiff$/i.test(
                          f
                        );
                        return m(
                          'a[target=_blank]',
                          { href: f },
                          isImg
                            ? m('img', {
                                src: f,
                                alt: f,
                                style: 'max-height: 75px',
                              })
                            : m('span', f)
                        );
                      })
                  ),
                  m('span', message.title),
                ])
              )
            )
          ),
          currentRoom && [
            m(TextInput, {
              label: 'New message',
              iconName: 'edit',
              initialValue: msg?.title,
              onchange: txt =>
                currentRoom && actions.updateMessage({ title: txt }),
            }),
            m(FileInput, { multiple: true, onchange: f => (files = f) }),
            m(FlatButton, {
              iconName: 'add',
              disabled: !msg || !currentRoom,
              onclick: msg
                ? () => {
                    if (currentUser && files) {
                      upload(files, currentUser);
                      msg.media = [];
                      // tslint:disable-next-line: prefer-for-of
                      for (let i = 0; i < files.length; i++) {
                        msg.media.push(
                          `${apiServer()}/${currentUser.$loki}/${files[i].name}`
                        );
                      }
                    }
                    msg.ownerId = currentUser.$loki;
                    actions.saveMessage(currentRoom, msg);
                  }
                : undefined,
            }),
          ],
        ]),
      ]);
    },
  };
};
