import api from "@/lib/api";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await api.delete("/auth/logout");
      localStorage.removeItem("authToken"); // トークンを削除
      alert("ログアウト成功");
    } catch (err) {
      console.error("ログアウトに失敗しました", err);
    }
  };

  return <button onClick={handleLogout}>ログアウト</button>;
}
