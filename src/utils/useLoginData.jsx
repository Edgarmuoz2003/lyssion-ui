import { useMainStore } from "../store/useMainStore";

export function useLogindata() {
 const user = useMainStore((state) => state.loginData?.user);
 const token = useMainStore((state) => state.loginData?.token);
 return { user, token, isAuthenticated: !!token };
}