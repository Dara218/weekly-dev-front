/**
 * Laravel Echo setup for Reverb WebSocket broadcasting.
 * Configures private channel authorization via the broadcasting auth endpoint.
 */
import { API_ENDPOINT } from '@/constants/endpoint';
import { api } from '@/services/common/http';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const reverbPort = Number(import.meta.env.VITE_REVERB_PORT) || 80;

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: reverbPort,
  wssPort: Number(import.meta.env.VITE_REVERB_WSS_PORT) || reverbPort,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
  enabledTransports: ['ws', 'wss'],
  /**
   * Authorizes private channel subscriptions through the backend.
   */
  authorizer: (channel) => {
    return {
      /**
       * Sends the socket ID and channel name to the broadcasting auth endpoint.
       *
       * @param {string} socketId - The Pusher socket ID.
       * @param {Function} callback - Echo callback to complete authorization.
       */
      authorize: (socketId, callback) => {
        api.post(API_ENDPOINT.BROADCASTING, {
          socket_id: socketId,
          channel_name: channel.name,
        })
        .then(response => {
          callback(false, response.data);
        })
        .catch(error => {
          callback(true, error);
        });
      }
    };
  },
});
