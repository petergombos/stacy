import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FileText, LogOut, Menu, Settings, User, Zap } from "lucide-react";
import Link from "next/link";

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "bg-gray-900 text-white shadow-md z-50 sticky top-0",
        className
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-2xl font-bold"
          >
            <Zap className="w-8 h-8 text-yellow-400" />
            <span>Stacy</span>
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/articles"
                className="text-base font-medium hover:text-gray-300 flex items-center"
              >
                <FileText className="w-5 h-5 mr-1" />
                Articles
              </Link>
              <Link
                href="/settings"
                className="text-base font-medium hover:text-gray-300 flex items-center"
              >
                <Settings className="w-5 h-5 mr-1" />
                Settings
              </Link>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/articles"
                    className="text-base font-medium hover:text-gray-300 flex items-center"
                  >
                    <FileText className="w-5 h-5 mr-1" />
                    Articles
                  </Link>
                  <Link
                    href="/settings"
                    className="text-base font-medium hover:text-gray-300 flex items-center"
                  >
                    <Settings className="w-5 h-5 mr-1" />
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
