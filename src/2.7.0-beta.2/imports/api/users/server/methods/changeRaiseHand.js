import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import { extractCredentials } from '/imports/api/common/server/helpers';
import RedisPubSub from '/imports/startup/server/redis';

export default async function changeRaiseHand(raiseHand, userId = undefined) {
  try {
    const REDIS_CONFIG = Meteor.settings.private.redis;
    const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
    const EVENT_NAME = 'ChangeUserRaiseHandReqMsg';

    const { meetingId, requesterUserId } = extractCredentials(this.userId);

    check(meetingId, String);
    check(requesterUserId, String);
    check(raiseHand, Boolean);

    const payload = {
      userId: userId || requesterUserId,
      raiseHand,
    };

    Logger.verbose('Updated raiseHand status for user', {
      meetingId, requesterUserId, raiseHand,
    });

    RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
  } catch (err) {
    Logger.error(`Exception while invoking method changeRaiseHand ${err.stack}`);
  }
}
