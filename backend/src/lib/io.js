import io from 'socket.io';

export default (http, subscribers) => {
  return io(http)
    .on('connection', socket => {
      console.log('CONNECTION_RECEIVED');

      Object.keys(subscribers)
        .map(type => ({ type, handler: subscribers[type] }))
        .forEach(subscriber => {
          socket.on(subscriber.type, (payload) => {
            console.log('__SUBSCRIBE_EVENT__', subscriber.type, payload);

            try {
              subscriber.handler(socket)(payload);
            } catch (e) {
              console.error('__SUBSCRIBER_ERROR__', e);
            }
          });
        });
    })
    .on('error', error => {
      console.error('__SOCKET_IO_ERROR__', error);
    });
}