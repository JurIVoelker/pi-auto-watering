import CenteredWrapper from "@/components/centered-wrapper";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <CenteredWrapper>
      <Card className="max-w-md w-[calc(100%-2rem)] min-w-[200px]">
        <CardHeader>
          <CardTitle>Fehler 404</CardTitle>
          <CardDescription>
            Diese Seite wurde nicht gefunden. Möchtest du zurück zum Dashboard?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "default" }), "w-full ")}
          >
            Zum Dashboard
          </Link>
        </CardContent>
      </Card>
    </CenteredWrapper>
  );
};

export default NotFoundPage;
