import { sendRequest } from "@/lib/httpRequest";
import { ServersInfo } from "./infoSlice";

export const getServerList = async () => {
  const response = await sendRequest<ServersInfo>("/api/servers", "GET");
  return response;
};
