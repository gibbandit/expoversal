export function authHeader() {
  const authKey = localStorage.getItem('authKey');
  return authKey ? { authorization: authKey } : null;
}

export async function fetchAuthToken(username: string) {
  const fetchRes = await fetch('http://localhost:3000/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
    }),
    redirect: 'follow',
  });

  if (!fetchRes.ok) {
    console.log(fetchRes);
  }

  const body = await fetchRes.json();

  localStorage.setItem('authKey', body.token);
  window.location.reload();
}

export function removeAuthToken() {
  localStorage.removeItem('authKey');
  window.location.reload();
}
