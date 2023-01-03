const sentTimeAgo = (dateTimeObject) => {
  const messageTime = dateTimeObject?.toDate();
  const currentTime = new Date();
  const timeDelta = messageTime - currentTime;
  const timeDeltaInSeconds = Math.round((timeDelta * -1) / 1000);
  const timeDeltaInMinutes = Math.round((timeDelta * -1) / 1000 / 60);
  const timeDeltaHours = Math.round((timeDelta * -1) / 1000 / 60 / 60);

  const time =
    timeDeltaInSeconds < 60
      ? `${timeDeltaInSeconds}s`
      : timeDeltaInMinutes < 60
      ? `${timeDeltaInMinutes}m`
      : timeDeltaHours < 60
      ? `${timeDeltaHours}h`
      : "";

  return time;
};

export default sentTimeAgo;
