import EasyPostMessage from 'easy-post-message';
import Adapter from 'easy-post-message/electron-adapter';

export const pm = new EasyPostMessage(Adapter);

pm.on('logger:debug', (message) => {
  console.debug(message.data);
});

pm.on('logger:error', (message) => {
  console.error(message.data);
});
