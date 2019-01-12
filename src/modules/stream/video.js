import { client } from '../../providers/engine/client';
import { UpEvent } from '../../event-name';
export default function Video() {
  return {
    disable: (user) => {
      return client.exec({
        event: UpEvent.VIDEO_DISABLE,
        type: 'stream',
        args: [user]
      });
    },
    enable: (user) => {
      return client.exec({
        event: UpEvent.VIDEO_ENABLE,
        type: 'stream',
        args: [user]
      });
    }
  };
}