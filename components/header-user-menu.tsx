"use client";

import { signOutAction } from "@/app/(auth)/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "lucia";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function HeaderUserMenu({ user }: { user: User }) {
  const router = useRouter();
  const { execute: executeSignOut, status } = useAction(signOutAction, {
    onSuccess: () => {
      toast.success("Signed out successfully");
      router.push("/sign-in");
    },
    onError: () => {
      toast.error("An error occurred while signing out");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full dark">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.firstName} />
            <AvatarFallback>
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => executeSignOut()}
          disabled={status === "executing"}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{status === "executing" ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
