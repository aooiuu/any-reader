import EasyPostMessage from 'easy-post-message';
import Adapter from 'easy-post-message/electron-adapter';

export const pm = new EasyPostMessage(Adapter);
