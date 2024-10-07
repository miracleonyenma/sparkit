"use client";

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Logout = () => {
  const { setUser } = useUserStore();
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout");
    const data = await res.json();
    console.log({ data });

    setUser(null);

    router.push("/");
  };

  useEffect(() => {
    handleLogout();
  }, []);
  return (
    <section className="site-section flex w-full flex-col max-lg:px-0 lg:justify-center">
      <div className="wrapper">
        <header className="section-header my-12">
          <div className="wrapper">
            <h1 className="mb-2 text-xl font-bold lg:text-5xl">
              Logging out...
            </h1>
          </div>
        </header>
      </div>
    </section>
  );
};

export default Logout;
