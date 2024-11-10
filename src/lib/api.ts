const API_BASE_URL = "http://localhost:3001"; // Rails APIサーバーのURL

export async function fetchDashboardData() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`);
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return await response.json();
}
