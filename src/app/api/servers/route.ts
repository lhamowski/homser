export const dynamic = "force-dynamic";

import { RemoteServer } from "@/server/remoteServersManager";
import { ServersInfo } from "@/lib/server/infoSlice";

const convertToServersInfo = (servers: RemoteServer[]): ServersInfo => {
  return servers.reduce((acc, server) => {
    acc[server.id] = {
      ip: server.ip,
      status: server.status,
      name: server.name,
      metrics: server.metrics,
    };
    return acc;
  }, {} as ServersInfo);
};

export async function GET(request: Request) {
  return Response.json(
    convertToServersInfo(globalThis.remoteServersManager.getRemoteServers())
  );
}
