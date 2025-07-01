"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";

interface LogEntry {
  frame: number;
  track_id: number;
  bbox: number[];
}

export default function TrackLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    api.get("/get_log").then((  res) => setLogs(res.data));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="text-lg font-roboto font-bold mb-2">Tracking Log</h3>
      <div className="h-64 overflow-y-scroll border p-2">
        {logs.map((log, idx) => (
          <div key={idx} className="border-b py-1 text-sm">
            Frame: {log.frame} | ID: {log.track_id} | Box: [
            {log.bbox.join(", ")}]
          </div>
        ))}
      </div>
    </div>
  );
}

