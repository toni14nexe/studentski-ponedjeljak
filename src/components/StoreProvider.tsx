import { createContext, FC, useContext, useRef } from "react";
import { Provider } from "react-redux";
import { store, AppDispatch } from "@/store/store";

// Create context for store and dispatch
const StoreContext = createContext<{
  store: typeof store;
  dispatch: AppDispatch | undefined;
}>({
  store,
  dispatch: undefined,
});

// Provider component to initialize store and provide it
export const StoreProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storeRef = useRef(store);
  return (
    <StoreContext.Provider
      value={{ store: storeRef.current, dispatch: storeRef.current.dispatch }}
    >
      <Provider store={storeRef.current}>{children}</Provider>
    </StoreContext.Provider>
  );
};

// Custom hook to access store and dispatch
export const useStore = () => useContext(StoreContext);

export default StoreProvider;
