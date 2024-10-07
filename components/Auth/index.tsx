"use client";

import { useUserStore } from "@/store/useUserStore";
import { MeResponse } from "@/utils/auth/me";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

const Auth = () => {
  const { user, setUser } = useUserStore();
  const pathname = usePathname();

  const handleGetUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = (await res.json()) as { data: MeResponse };
      const userData = data?.data?.me;
      console.log(
        "🚀 ~ file: index.tsx ~ line 12 ~ handleGetUser ~ userData: ",
        data,
        userData,
      );
      setUser(userData);
      return userData;
    } catch (error) {
      console.log(
        "🚨🚨🚨🚨🚨 ~ file: index.tsx ~ line 15 ~ handleGetUser ~ error",
        error,
      );
      setUser(null);
      return null;
    }
  }, [setUser]);

  useEffect(() => {
    console.log("WOW");

    !user?.id && handleGetUser();
  }, [user, handleGetUser, pathname]);
  return null;
};

export default Auth;
