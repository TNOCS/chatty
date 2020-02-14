import m, { Attributes, FactoryComponent } from 'mithril';
import { LayoutForm } from 'mithril-ui-form';
// import { labelResolver } from 'mithril-ui-form';
import { IGame } from '../../../common/src';
import { gameFormGenerator } from '../template/form';

export interface IFormattedEvent extends Attributes {
  game: Partial<IGame>;
  filterValue?: string;
}

/**
 * Display the form in a format that is useful for the end user.
 * In this case, it will be a trainer interface for controlling a game.
 */
export const DisplayForm: FactoryComponent<IFormattedEvent> = () => {
  // const state = {
  //   showDetails: undefined,
  //   resolveObj: labelResolver(ScenarioForm),
  // } as {
  //   resolveObj: <T>(obj: any, parent?: string | undefined) => T | undefined;
  //   showDetails?: string;
  // };

  return {
    view: ({ attrs: { game } }) => {
      const { title /** $loki */ } = game;
      const form = gameFormGenerator(game);

      return m('.row', { key: game.$loki }, [
        m('.row', m('h4.col.s12.primary-text', title)),
        m(
          '.row',
          m(LayoutForm, {
            form,
            obj: game,
            readonly: true,
          })
        ),
      ]);
    },
  };
};
