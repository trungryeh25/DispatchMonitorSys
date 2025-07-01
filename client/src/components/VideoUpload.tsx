import { useState } from "react";
import api from "@/utils/api";

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a video file!");

    const formData = new FormData();
    formData.append("video", file);

    try {
      const res = await api.post("/process_video", formData);
      alert("Video uploaded & processed!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error uploading video");
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-roboto font-bold mb-2">Upload Video</h2>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
}
