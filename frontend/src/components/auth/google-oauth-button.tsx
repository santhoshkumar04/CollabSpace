import { baseURL } from "@/lib/base-url";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";

export default function GoogleOauthButton({ label }: { label: string }) {
  const handleOnClick = () => {
    console.log("google auth");
    window.location.href = `${baseURL}/api/auth/google`;
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={handleOnClick}
    >
      <Icons.google />
      {label} with Google
    </Button>
  );
}
