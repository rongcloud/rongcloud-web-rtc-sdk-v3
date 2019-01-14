import { UpEvent } from '../../event-name';
import utils from '../../utils';
import { check, getError } from '../common';

export default function Audio(client) {
  return {
    mute: (user) => {
      let { isIllegal, name } = check(user, ['id', 'stream.tag']);
      if (isIllegal) {
        let error = getError(name);
        return utils.Defer.reject(error);
      }
      return client.exec({
        event: UpEvent.AUDIO_MUTE,
        type: 'stream',
        args: [user]
      });
    },
    unmute: (user) => {
      let { isIllegal, name } = check(user, ['id', 'stream.tag']);
      if (isIllegal) {
        let error = getError(name);
        return utils.Defer.reject(error);
      }
      return client.exec({
        event: UpEvent.AUDIO_UNMUTE,
        type: 'stream',
        args: [user]
      });
    }
  };
}