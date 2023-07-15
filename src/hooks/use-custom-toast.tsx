import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function useCustomToast() {
  function loginToast() {
    const loginToastMessage = toast.custom(
      <Link
        href="/sign-in"
        onClick={() => toast.dismiss()}
        className={buttonVariants({ variant: "outline" })}
      >
        Login
      </Link>
    );
  }

  return { loginToast };
}
