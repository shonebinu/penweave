import { Bookmark, ExternalLink, GitFork, Play } from "lucide-react";
import numbro from "numbro";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { PlaygroundMeta } from "@/types/firestore";

interface BasePlaygroundCardProps {
  playground: PlaygroundMeta;
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
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <p className="truncate text-sm" title={playground.title}>
              {playground.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {playground.isForked && (
                <a
                  href={`/playground/${playground.forkedFrom}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex items-center gap-1 hover:underline">
                    src
                    <ExternalLink size={12} />
                  </span>
                </a>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <GitFork size={12} />
              <span>
                {numbro(playground.forkCount).format({
                  average: true,
                  mantissa: 1,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark size={12} />
              <span>
                {numbro(playground.bookmarkCount).format({
                  average: true,
                  mantissa: 1,
                })}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardFooter className="flex items-center justify-between px-3 py-2 pt-3">
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
