import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebase from "../firebase/firebase";

const useAuthRedirect = path => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        dispatch(setUser(user));
        history.push(path);
      }
    });
  }, [dispatch, history, path]);
};

export default useAuthRedirect;
