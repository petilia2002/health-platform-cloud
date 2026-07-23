import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./store/authSlice";
import AppRouter from "./router/AppRouter";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  return <AppRouter />;
}
