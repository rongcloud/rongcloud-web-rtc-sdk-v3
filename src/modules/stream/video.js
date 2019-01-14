import { UpEvent } from '../../event-name';
import { check, getError } from '../common';
import utils from '../../utils';
export default function Video(client) {
  return {
    disable: (user) => {
      let { isIllegal, name } = check(user, ['id', 'stream.tag']);
      if (isIllegal) {
        let error = getError(name);
        return utils.Defer.reject(error);
      }
      return client.exec({
        event: UpEvent.VIDEO_DISABLE,
        type: 'stream',
        args: [user]
      });
    },
    enable: (user) => {
      let { isIllegal, name } = check(user, ['id', 'stream.tag']);
      if (isIllegal) {
        let error = getError(name);
        return utils.Defer.reject(error);
      }
      return client.exec({
        event: UpEvent.VIDEO_ENABLE,
        type: 'stream',
        args: [user]
      });
    }
  };
}