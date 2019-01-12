import { client } from '../../providers/engine/client';
import { UpEvent } from '../../event-name';
export default function Audio(){
  return {
    mute: (user) => {
      return client.exec({
        event: UpEvent.AUDIO_MUTE,
        type: 'stream',
        args: [user]
      });
    },
    unmute: (user) => {
      return client.exec({
        event: UpEvent.AUDIO_UNMUTE,
        type: 'stream',
        args: [user]
      });
    }
  };
}