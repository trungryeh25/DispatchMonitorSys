"use client";

import { useState } from "react";
import api from "@/utils/api";
import FeedbackForm from "@/components/FeedbackForm";

interface PredictResult {
  index: number;
  type: string;
  class_label: string;
  box: number[];
  confidence: number;
}

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictResult[] | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;
    if (newFile) {
      setFile(newFile);
      setResult(null);
      setImageUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image!");
      return;
    }

    setLoading(true);
    setResult(null);
    setImageUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data.results);
      setImageUrl(`${process.env.NEXT_PUBLIC_API_URL}${res.data.image_url}`);
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded shadow bg-white mx-auto">
      <h2 className="text-sm font-roboto font-bold mb-4 text-cyan-900 text-center">
        UPLOAD IMAGE
      </h2>

      <div className="flex flex-col items-center mb-4">
        <label
          htmlFor="file-upload"
          className="px-4 py-2 bg-[#99CCFF] text-white font-roboto font-semibold rounded hover:bg-blue-500 cursor-pointer"
        >
          Choose Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {file && (
          <span className="text-sm font-roboto text-gray-600 mt-2">
            {file.name}
          </span>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`px-4 py-2 ${
            !file || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white font-roboto rounded`}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>

      {imageUrl && (
        <div className="mt-6 flex flex-col items-center space-y-6">
          <img
            src={imageUrl}
            alt="Predicted"
            className="w-[440px] h-[440px] rounded border"
          />
          <span className="text-sm font-roboto text-gray-600 mb-20">
            Image is predicted
          </span>
          {result && <FeedbackForm results={result} imageUrl={imageUrl} />}
        </div>
      )}
    </div>
  );
}
