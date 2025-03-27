"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GridCardProps {
  description?: string;
  content?: string;
  onClick?: () => void;
  buttonLabel?: string;
  className?: string;
}

const GridCard: React.FC<GridCardProps> = ({
  content,
  description,
  className,
  onClick,
  buttonLabel,
}) => {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center h-full">
        <p className="text-center text-muted-foreground text-sm">
          {description}
        </p>
        <h4 className="text-center mt-1">{content}</h4>
        {onClick && (
          <Button
            onClick={onClick}
            className="w-full mt-4
          "
          >
            {buttonLabel || "Ändern"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GridCard;
