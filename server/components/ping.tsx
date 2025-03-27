import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Wifi, WifiOff } from "lucide-react";

interface PingProps {
  className?: string;
  isConnected: boolean;
}

const Ping: React.FC<PingProps> = ({ className, isConnected }) => {
  return (
    <TooltipProvider>
      {isConnected && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn("relative inline-flex size-3", className)}>
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75"
                style={{ animationDuration: "2s", animationDelay: "1s" }}
              />
              <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
            </span>
          </TooltipTrigger>

          <TooltipContent>
            <p className="flex gap-1.5 items-center justify-center">
              <Wifi className="size-4 inline" />
              <span> Verbunden mit Server</span>
            </p>
          </TooltipContent>
        </Tooltip>
      )}
      {!isConnected && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn("relative inline-flex size-3", className)}>
              <span className="absolute inline-flex rounded-full bg-red-300 opacity-30 size-5 top-[-4px] right-[-4px]" />
              <span className="relative inline-flex size-3 rounded-full bg-red-500" />
            </span>
          </TooltipTrigger>

          <TooltipContent>
            <p className="flex gap-1.5 items-center justify-center">
              <WifiOff className="size-4 inline" />
              <span>Keine Verbindung zum Server</span>
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  );
};

export default Ping;
