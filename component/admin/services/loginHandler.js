export async function loginHandler({ userName, password, signal } = {}) {
  const response = await fetch("http://localhost:5000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || !data?.token) {
    return {
      ok: false,
      data: null,
      message: data?.message || "Invalid username or password.",
      status: response.status,
    };
  }

  return {
    ok: true,
    data,
    message: "",
    status: response.status,
  };
}
