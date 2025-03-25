import { cn } from "@/lib/utils";
import Wrapper from "./wrapper";

interface WrapperProps {
  children?: React.ReactNode;
  className?: string;
}

const CenteredWrapper: React.FC<WrapperProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Wrapper
      className={cn(
        "h-[calc(100vh-4rem)] mb-8 flex items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Wrapper>
  );
};

export default CenteredWrapper;
