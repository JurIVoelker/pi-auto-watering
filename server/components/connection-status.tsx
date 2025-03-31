import { SYNC_INTERVAL } from "@/constants/constants";
import Ping from "./ping";

export const revalidate = 30;

interface ConnectionStatusProps {
  lastPing?: Date;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ lastPing }) => {
  const isConnected = lastPing
    ? new Date().getTime() - lastPing.getTime() < SYNC_INTERVAL * 1.5
    : false;
  return (
    <div className="bg-gray-50 px-4 py-2 rounded-md flex items-center justify-center gap-2">
      <p className="text-sm inline">Verbindung zum Server</p>
      <Ping isConnected={isConnected} />
    </div>
  );
};

export default ConnectionStatus;
