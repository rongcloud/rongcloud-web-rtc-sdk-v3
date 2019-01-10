import {UpEvent} from '../../event-name';
import utils from '../../utils';
function StreamHandler() {
  let publish = () => {
    return utils.deferred(() => {

    });
  };
  let unpublish = () => {
    return utils.deferred(() => {

    });
  };
  let open = () => {
    return utils.deferred(() => {

    });
  };
  let close = () => {
    return utils.deferred(() => {

    });
  };
  let resize = () => {
    return utils.deferred(() => {

    });
  };
  let get = () => {
    return utils.deferred(() => {

    });
  };
  let dispatch = (event, args) => {
    switch(event){
    case UpEvent.STREAM_PUBLISH:
      return publish(...args);
    case UpEvent.STREAM_UNPUBLISH:
      return unpublish(...args);
    case UpEvent.STREAM_OPEN:
      return open(...args);
    case UpEvent.STREAM_CLOSE:
      return close(...args);
    case UpEvent.STREAM_RESIZE:
      return resize(...args);
    case UpEvent.STREAM_GET:
      return get(...args);
    default: 
      utils.Logger.log(`StreamHandler: unkown upevent ${event}`);
    }
  };
  return {
    dispatch
  };
}
export default StreamHandler();  