/* eslint-disable @next/next/no-img-element */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SessionData } from "@/lib/auth";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { SiteSettingsDialog } from "../site/site-settings";
import { TooltipProvider } from "../ui/tooltip";
import { PublishDialog } from "./publish";
import { saveStatus$ } from "@/app/dashboard/state";
import { SitePicker } from "../site/sites-picker";

const SaveStatus = () => {
  const status = saveStatus$.get();

  return (
    <span className="text-sm italic text-gray-400">
      {status == "saved" && "Saved"}
      {status == "saving" && "Saving..."}
      {status == "unsaved" && "Unsaved "}
    </span>
  );
};

export const SiteNav = () => {
  const session = useSession().data as SessionData;
  const params = useParams();
  const query = useSearchParams();
  const pageId = query.get("id");
  const siteId = params.siteId as string;
  const path = usePathname();

  return (
    <TooltipProvider>
      <div className="nav-bar">
        <div className="brand-nav-links flex items-center">
          <div className="logo mr-4">
            <Link href={"/dashboard"}>
              <img src="/logo-small.svg" alt="Stubby logo" className="h-8" />
            </Link>
          </div>
          <div className="nav-links">
            {siteId && (
              <div className="flex items-center gap-4">
                <div className="sites-dropdown">
                  <SitePicker />
                </div>

                <Link
                  href={`/dashboard/${siteId}/content`}
                  className={clsx("site-nav-item", {
                    active: path === `/dashboard/${siteId}/content`,
                  })}
                >
                  Content
                </Link>

                <Link
                  href={`/dashboard/${siteId}/playground`}
                  className={clsx("site-nav-item", {
                    active: path === `/dashboard/${siteId}/playground`,
                  })}
                >
                  API Playground
                </Link>

                <SiteSettingsDialog
                  siteId={siteId}
                  trigger={<button className="site-nav-item">Settings</button>}
                />
              </div>
            )}
          </div>
        </div>
        <div className="actions flex items-center gap-4">
          {pageId ? (
            <div className="flex items-center gap-4">
              <SaveStatus />
              <PublishDialog />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={session?.user.image} />
                  <AvatarFallback>{session?.user.name[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                <DropdownMenuItem
                  onSelect={() => {
                    window.open(
                      `${process.env.NEXT_PUBLIC_HOST}/docs/quick-start`,
                      "_blank",
                    );
                  }}
                >
                  Docs
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    signOut();
                    // Clear the cookie so the user is marked as logged out on the client
                    // this is used to show the login/dashboard button in the marketing nav
                    document.cookie = "stubby.auth=; path=/";
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
