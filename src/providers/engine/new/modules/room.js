import { SignalEvent } from '../events';
import utils from '../../../../utils';

export default function Room(rtc) {
  let join = (room) => {
    return utils.deferred((resolve, reject) => {
      rtc.once(SignalEvent.JoinAck, (error, room) => {
        if (error) {
          return reject(error);
        }
        resolve(room);
      });
      rtc.emit(SignalEvent.Join, room);
    });
  };

  let quit = (room) => {
    return utils.deferred((resolve, reject) => {
      rtc.once(SignalEvent.LeaveAck, (error) => {
        if(error){
          return reject(error);
        }
        resolve();
      });
      rtc.emit(SignalEvent.LeaveAck, room);
    });
  };

  return {
    join,
    quit
  }
}