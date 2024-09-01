import { Session } from 'electron/main';

export function hookRequest(session: Session) {
  const mUrlDetails = new Map<number, any>();

  session.webRequest.onBeforeSendHeaders((details, callback) => {
    if (mUrlDetails.has(details.id)) {
      Object.assign(details.requestHeaders, mUrlDetails.get(details.id));
      mUrlDetails.delete(details.id);
    }
    callback({ requestHeaders: details.requestHeaders });
  });

  session.webRequest.onBeforeRequest(
    {
      urls: ['http://*/*', 'https://*/*']
    },
    (details, callback) => {
      const urls = details.url.split(/@headers?/);
      if (urls.length === 2) {
        try {
          const headers = JSON.parse(decodeURIComponent(urls[1]));
          mUrlDetails.set(details.id, headers);
        } catch (error) {
          console.error(error);
        }
        callback({ cancel: false, redirectURL: urls[0] });
        return;
      }
      callback({ cancel: false });
    }
  );
}
