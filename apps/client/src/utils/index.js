import { appReducer } from './reducers.js';
import { LuCircleAlert } from '@components/Icons.jsx';

export { appReducer };

// -----------------------
// Session
// -----------------------
const TOKEN_KEY = 'AccessToken';

export const session = {
  set(token, key = TOKEN_KEY) {
    window.sessionStorage.setItem(key, JSON.stringify(token));
  },
  get(key = TOKEN_KEY) {
    return JSON.parse(window.sessionStorage.getItem(key) || "\"\"");
  },
  clear(key = TOKEN_KEY) {
    window.sessionStorage.removeItem(key);
  },
  isLoggedIn() {
    return !!window.sessionStorage.getItem(TOKEN_KEY);
  }
};

// -----------------------
// API Fetch
// -----------------------
const BaseURL = "";
let Refreshed = false;

export async function apiFetch(url, options = {}) {
  try {
    const res = await window.fetch(BaseURL + url, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        "Content-Type": "application/json",
        ...(options.bearer ? { Authorization: `Bearer ${options.bearer}` } : {}),
        credentials: 'include'
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {})
    });

    if (res.status === 403 && !Refreshed) {
      Refreshed = true;

      try {
        const _res = await window.fetch('/api/v1/auth/refresh', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            credentials: 'include'
          }
        });

        if (!_res.ok) {
          return { ok: false, data: { redirect: '/auth/login', msg: 'Session expired, please login again.' } };
        }
        const { accessToken } = await _res.json();
        session.set(accessToken);
        return apiFetch(url, { ...options, bearer: accessToken });
      } catch (_err) {
        return { ok: false, data: { err: _err.message } };
      }
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) throw new Error('something went wrong');
    const data = await res.json();
    return { ok: res.ok, data };

  } catch (err) {
    const data = { err: err.message || 'Unknown Error' };
    return { ok: false, data };
  } finally {
    Refreshed = false;
  }
}

// -----------------------
// Regex
// -----------------------
export const regex = {
  name: /^(?!.*(\.|\s{2,}))(?=.*?\p{L})[\p{L}.'-]+(?: +[\p{L}.'-]+)*$/u,
  mobile: /^254[1,7][0-9]{8}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  userid: /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|254[1,7][0-9]{8})$/,
  secret: /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.{8,})/
}

// -----------------------
// Modal
// -----------------------
export const showModal = (props, msg, clr = 'orangered', Icon = LuCircleAlert) => props.dispatch({
  type: 'setModal', value: {
    on: true, msg, icon: <Icon size={32} color={clr} />
  }
});

// -----------------------
// Loader
// -----------------------
export const toggleLoader = (props, status = 'off') => props.dispatch && props.dispatch({
  type: 'setLoader', value: status === 'on'
});