import { useSelector } from "react-redux";

const useSocket = () => {
  //  CHANGED: We are now pulling the socket from 'state.auth' instead of 'state.socket'
  const { socket } = useSelector((state) => state.auth);

  return socket;
};

export default useSocket;
