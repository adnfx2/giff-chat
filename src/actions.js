/* action types*/
export const SET_USER = "SET_USER";

/* action creator */
export const setUser = user => ({
  type: SET_USER,
  payload: { currentUser: user }
});
