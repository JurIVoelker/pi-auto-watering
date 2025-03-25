import { cn } from "@/lib/utils";

interface WrapperProps {
  children?: React.ReactNode;
  className?: string;
}

const Wrapper: React.FC<WrapperProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "max-w-[1200px] mx-auto w-[calc(100%-4rem)] mt-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Wrapper;
