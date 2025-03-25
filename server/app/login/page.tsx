import LoginCard from "@/components/pages/login-card";
import Wrapper from "@/components/wrapper";

const LoginPage = () => {
  return (
    <Wrapper className="h-[calc(100vh-4rem)] mb-8 flex items-center justify-center">
      <LoginCard />
    </Wrapper>
  );
};

export default LoginPage;
