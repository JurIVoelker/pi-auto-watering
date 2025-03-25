import CenteredWrapper from "@/components/centered-wrapper";
import LoginCard from "@/components/pages/login-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <CenteredWrapper>
      <Suspense
        fallback={
          <Skeleton className="max-w-md w-[calc(100%-2rem)] min-w-[200px] h-58" />
        }
      >
        <LoginCard />
      </Suspense>
    </CenteredWrapper>
  );
};

export default LoginPage;
