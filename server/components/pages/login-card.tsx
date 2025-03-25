"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { postRequest } from "@/lib/api/requestUtils";
import { Label } from "@radix-ui/react-label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const LoginCard = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { push } = useRouter();

  const handleSubmit = async () => {
    const res = await postRequest("/api/login", { password });
    if (res.error) {
      setError(res.error[0].message);
      setPassword("");
    } else {
      setError("");
      if (redirect) {
        push(redirect);
      } else {
        push("/dashboard");
      }
    }
  };

  return (
    <Card className="max-w-[400px] w-[calc(100%-2rem)] min-w-[200px]">
      <CardHeader>
        <CardTitle className="font-bold">Login</CardTitle>
        <CardDescription>
          Gebe deine Zugangsdaten ein um dich einzuloggen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password" className="text-sm">
              Passwort
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {error && (
              <span className="text-sm text-destructive mt-2">{error}</span>
            )}
          </div>
          <Button type="submit" className="mt-4 w-full">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
