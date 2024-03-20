"use client";

import React, { useEffect, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";

import { changeServerState } from "@/lib/server/control";
import { useAppSelector } from "@/lib/hooks";
import { selectServerStatus } from "@/lib/server/infoSlice";
import { ServerAction } from "@/lib/server/action";
import { RemoteServerStatus } from "@/app/remoteServerStatus";

interface ServerActionsProps {
  id: number;
}

const actionTextFromStatus = (status: RemoteServerStatus) => {
  switch (status) {
    case RemoteServerStatus.Started:
      return "Stop";
    case RemoteServerStatus.Stopped:
      return "Start";
    case RemoteServerStatus.Starting:
    case RemoteServerStatus.Stopping:
      return status;
  }
};

const actionButtonColorFromStatus = (status: RemoteServerStatus) => {
  switch (status) {
    case RemoteServerStatus.Started:
      return "error";
    case RemoteServerStatus.Stopped:
      return "success";
    case RemoteServerStatus.Starting:
    case RemoteServerStatus.Stopping:
      return "warning";
  }
};

const ServerActions = (props: ServerActionsProps) => {

  const serverStatus = useAppSelector((state) =>
    selectServerStatus(state, props.id)
  );

  useEffect(() => {
    setChanging(false);
  }, [serverStatus]);

  const [changing, setChanging] = useState(false);

  const handleChangeState = async (status: RemoteServerStatus) => {
    if (
      status == RemoteServerStatus.Starting ||
      status == RemoteServerStatus.Stopping
    ) {
      return;
    }

    setChanging(true);

    try {
      const action =
        status != RemoteServerStatus.Started
          ? ServerAction.Start
          : ServerAction.Stop;
      await changeServerState(props.id, action);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Request failed: ", error.message);
      } else {
        console.error("Request failed with unknown error");
      }
      setChanging(false);
    }
  };

  return (
    <LoadingButton
      variant="contained"
      sx={{ mr: 2, ml: 2, fontSize: "30px" }}
      color={actionButtonColorFromStatus(serverStatus)}
      disabled={
        serverStatus == RemoteServerStatus.Starting ||
        serverStatus == RemoteServerStatus.Stopping
      }
      loading={changing}
      onClick={() => handleChangeState(serverStatus)}
    >
      {actionTextFromStatus(serverStatus)}
    </LoadingButton>
  );
};

export default ServerActions;
