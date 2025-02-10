import { Button } from "@/components/ui/button";
import { Info, MoveLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <section className="bg-background">
      <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-secondary-foreground rounded-full bg-secondary">
            <Info className="w-6 h-6" />
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">
            Page not found
          </h1>
          <p className="mt-4 text-muted-foreground">
            The page you are looking for doesn't exist. Here are some helpful
            links:
          </p>

          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <Button onClick={() => navigate(-1)} variant={"outline"}>
              <MoveLeft className="w-5 h-5 rtl:rotate-180" />
              <span>Go back</span>
            </Button>

            <Button onClick={() => navigate("/")} variant={"default"}>
              Take me home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
