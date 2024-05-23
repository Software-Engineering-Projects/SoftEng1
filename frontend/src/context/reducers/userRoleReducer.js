
const userRoleReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_ROLE":
      return state;
    case "SET_ROLE":
      return action.role
    case "SET_ROLE_NULL":
      return null;
    default:
      return state;
  }
};

export default userRoleReducer;
