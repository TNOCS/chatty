import { ILokiObj } from './loki';

/** A 'chat' message */
export interface IMessage extends ILokiObj {
  /** ID of the owner */
  ownerId?: number;
  /** Specify the layout type */
  layoutType?: string;
  /** Short title to describe the message */
  title?: string;
  /** UTF-8 encoded message, may contain markdown. */
  txt?: string;
  /** Optional map layer */
  json?: GeoJSON.FeatureCollection;
  /** Optional image or media links */
  media?: string[];
}
