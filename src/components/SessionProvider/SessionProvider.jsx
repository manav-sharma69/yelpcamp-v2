"use client";
import React from "react";
import {
  getSession as getSessionServerSide,
  getUserRole,
} from "@/utils/auth/helpers";
import useToggle from "@/utils/hooks/use-toggle";
import { usePathname, useRouter } from "next/navigation";

export const SessionContext = React.createContext();

export default function SessionProvider({ children }) {
  const [session, setSession] = React.useState();
  const [role, setRole] = React.useState();
  const [disableCTA, toggleCTAs] = useToggle();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    async function asyncEffect() {
      const nextSession = await getSessionServerSide();
      const role = await getUserRole();
      console.log("onload session", nextSession);
      setSession(nextSession);
      setRole(role);
    }
    asyncEffect();
  }, [pathname]);

  function refresh() {
    React.startTransition(async () => {
      const nextSession = await getSessionServerSide();
      const nextRole = await getUserRole();
      setRole(nextRole);
      // console.log("fresh session:", nextSession);
      setSession(nextSession);
      router.refresh();
    });
  }

  const values = React.useMemo(
    () => ({ session, refresh, toggleCTAs, disableCTA, role }),
    [session, disableCTA, role]
  );

  return (
    <SessionContext.Provider value={values}>{children}</SessionContext.Provider>
  );
}
