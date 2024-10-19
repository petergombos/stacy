import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { validateRequest } from "@/lib/lucia/utils";
import { cn } from "@/lib/utils";
import { FileText, Menu, Zap } from "lucide-react";
import Link from "next/link";
import { HeaderUserMenu } from "./header-user-menu";

export async function Header({ className }: { className?: string }) {
  const { user } = await validateRequest();

  return (
    <header
      className={cn(
        "bg-neutral-900 text-white shadow-md sticky top-0",
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
          {user && (
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Link
                  href="/projects"
                  className="text-base font-medium hover:text-neutral-300 flex items-center"
                >
                  <FileText className="w-5 h-5 mr-1" />
                  Projects
                </Link>
              </nav>
              <HeaderUserMenu user={user} />
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
                      href="/projects"
                      className="text-base font-medium hover:text-neutral-300 flex items-center"
                    >
                      <FileText className="w-5 h-5 mr-1" />
                      Projects
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          )}
          {!user && (
            <div>
              <nav className="hidden md:flex gap-3">
                <Link
                  href="/sign-in"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "sm",
                    className: "dark",
                  })}
                >
                  Sign up
                </Link>
              </nav>
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
                      href="/sign-in"
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      className={buttonVariants({
                        size: "sm",
                        className: "dark",
                      })}
                    >
                      Sign up
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
