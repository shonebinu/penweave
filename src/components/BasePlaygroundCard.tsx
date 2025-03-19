import { Play } from "lucide-react";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Playground } from "@/types/firestore";

interface BasePlaygroundCardProps {
  playground: Playground;
  children?: React.ReactNode;
}

export default function BasePlaygroundCard({
  playground,
  children,
}: BasePlaygroundCardProps) {
  return (
    <Card className="group overflow-hidden rounded-sm transition-all hover:shadow-md">
      <div className="relative">
        <iframe
          srcDoc={`
            <html>
              <head><style>${playground.css}</style></head>
              <body>${playground.html}<script>${playground.js}</script></body>
            </html>
          `}
          sandbox="allow-scripts"
          className="h-40 w-full border-b bg-slate-50"
          title={playground.title}
        />
      </div>

      <CardHeader className="px-4 py-2 pb-0">
        <p className="truncate" title={playground.title}>
          {playground.title}
        </p>
      </CardHeader>

      <CardFooter className="flex items-center justify-between px-3 py-2">
        <Button variant="secondary" size="sm" asChild>
          <Link to={`/playground/${playground.id}`}>
            <Play /> Open
          </Link>
        </Button>
        <div className="flex items-center space-x-2">{children}</div>
      </CardFooter>
    </Card>
  );
}
