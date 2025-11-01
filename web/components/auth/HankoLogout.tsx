"use client"; //Only for NextJS App Router

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hanko } from "@teamhanko/hanko-elements";
import Button from "../core/Button";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || '';

export default function HankoLogout() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [hanko, setHanko] = useState<Hanko>();

  useEffect(() => setHanko(new Hanko(hankoApi ?? "")), []);

  const logout = async () => {
    try {
      setLoading(true);
      await hanko?.logout();
      // router.push("/");
      router.refresh();
      return;
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return <Button onClick={logout} isLoading={loading}>Log Out</Button>;
}