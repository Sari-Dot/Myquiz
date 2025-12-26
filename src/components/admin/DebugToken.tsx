import { useState } from "react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export function DebugToken() {
  const [result, setResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const testToken = async () => {
    setTesting(true);
    const token = localStorage.getItem("adminToken");

    console.log("[DEBUG] Testing token from localStorage:", token);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-99be6423/debug/verify-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();
      setResult(data);
      console.log("[DEBUG] Token verification result:", data);
    } catch (error) {
      console.error("[DEBUG] Error:", error);
      setResult({ error: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 border border-[#FF8C00] p-4 rounded max-w-md z-50">
      <h3 className="text-[#FF8C00] mb-2">🔍 DEBUG TOKEN</h3>
      
      <button
        onClick={testToken}
        disabled={testing}
        className="bg-[#FF8C00] text-black px-4 py-2 rounded hover:bg-[#FFA500] disabled:opacity-50 mb-2"
      >
        {testing ? "Testing..." : "Test Current Token"}
      </button>

      {result && (
        <pre className="text-xs text-white overflow-auto max-h-96 bg-black/50 p-2 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}