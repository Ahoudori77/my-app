"use client";

import { useEffect, useState } from "react";
import { fetchDashboardData } from "@/lib/api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData()
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
