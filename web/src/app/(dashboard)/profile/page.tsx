import HankoProfile from "@/components/auth/HankoProfile";
import NoSSR from "@/components/core/NoSSR";

export default function ProfilePage() {
  return (
    <div className="h-full flex justify-center items-center">
      <NoSSR>
        <HankoProfile />
      </NoSSR>
    </div>
  );
}
