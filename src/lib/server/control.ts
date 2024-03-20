import { sendRequest } from "@/lib/httpRequest";
import { ServerAction } from "@/lib/server/action";

export const changeServerState = async (id: number, action: ServerAction) => {
  const url = `/api/servers/${id}/state`;
  await sendRequest(url, "PUT", action);
};
