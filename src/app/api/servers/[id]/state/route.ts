import { NextRequest } from "next/server";

import { ServerAction, isServerActionValid } from "@/lib/server/action";
import { RemoteServerStatus } from "@/app/remoteServerStatus";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const foundServer = globalThis.remoteServersManager
    .getRemoteServers()
    .find((server) => server.id == params.id);

  if (!foundServer) {
    return Response.json({ error: "Server not found" }, { status: 404 });
  }

  const action = await request.json();
  if (!isServerActionValid(action)) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  switch (foundServer.status) {
    case RemoteServerStatus.Starting:
    case RemoteServerStatus.Stopping:
      return Response.json({ error: "Bad request" }, { status: 400 });
  }

  if (
    action === ServerAction.Stop &&
    foundServer.status === RemoteServerStatus.Stopped
  ) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  if (
    action === ServerAction.Start &&
    foundServer.status === RemoteServerStatus.Started
  ) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  if (action === ServerAction.Start) {
    const attempts = 3;
    for (let i = 0; i < attempts; i++) {
      const result = await foundServer.turnOn();
      if (!result) {
        return Response.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    }
  }

  if (action === ServerAction.Stop) {
    const result = await foundServer.turnOff();
    if (!result) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  globalThis.remoteServersManager.setRemoteServerStatus(
    foundServer.id,
    action === ServerAction.Start
      ? RemoteServerStatus.Starting
      : RemoteServerStatus.Stopping
  );

  return Response.json({ status: 200 });
}
