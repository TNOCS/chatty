import m from 'mithril';
import { SlimdownView } from 'mithril-ui-form';

const md = `#### About this application

Chat icon: chat by Dávid Gladiš from the Noun Project.`;

export const AboutPage = () => ({
  view: () =>
    m('.row', [
      m(SlimdownView, { md }),
      // m('.row', m('img', { src: driverLogo, width: 300, height: 151, style: 'display: block; margin: 0 auto;' })),
    ]),
});
