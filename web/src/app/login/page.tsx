import HankoAuth from "@/components/auth/HankoAuth";
import NoSSR from "@/components/core/NoSSR";

export default function LoginPage() {
  return (
    <div className="h-screen flex justify-center items-center">
      <NoSSR>
        <HankoAuth />
      </NoSSR>
    </div>
  );
}
