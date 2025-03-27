import Ping from "./ping";

export const revalidate = 30;

const ConnectionStatus = () => {
  // const lastConnection = new Date();
  const isConnected = true;
  return (
    <div className="bg-gray-50 px-4 py-2 rounded-md flex items-center justify-center gap-2">
      <p className="text-sm inline">Verbindung zum Server</p>
      {isConnected && <Ping isConnected={isConnected} />}
    </div>
  );
};

export default ConnectionStatus;
