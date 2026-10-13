const storeInSession = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
  try {
    sessionStorage.setItem(key, value);
  } catch {}
};

const lookInSession = (key) => {
  try {
    const val = localStorage.getItem(key);
    if (val !== null) return val;
  } catch {}
  try {
    return sessionStorage.getItem(key);
  } catch {}
  return null;
};

const removeFromSession = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
  try {
    sessionStorage.removeItem(key);
  } catch {}
};

const logOutUser = () => {
  try {
    localStorage.removeItem("user");
  } catch {}
  try {
    sessionStorage.clear();
  } catch {}
};

export { storeInSession, lookInSession, removeFromSession, logOutUser };
