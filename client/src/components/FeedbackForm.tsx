"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PredictResult {
  index: number;
  type: string;
  class_label: string;
  box: number[];
  confidence: number;
}

interface FeedbackFormProps {
  results: PredictResult[];
  imageUrl: string;
}

export default function FeedbackForm({ results, imageUrl }: FeedbackFormProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    results[0]?.index || 0
  );

  const selectedResult = results.find((r) => r.index === selectedIndex);

  const initialFormData = {
    type: selectedResult?.type || "",
    classLabel: selectedResult?.class_label || "",
    confidence: selectedResult?.confidence || 0,
    note: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [invalidBox, setInvalidBox] = useState(false);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndex = parseInt(e.target.value, 10);
    const newResult = results.find((r) => r.index === newIndex);

    setSelectedIndex(newIndex);
    if (newResult) {
      setFormData({
        type: newResult.type,
        classLabel: newResult.class_label,
        confidence: newResult.confidence,
        note: "",
      });
      setInvalidBox(false); // reset checkbox
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInvalidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvalidBox(e.target.checked);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_id: imageUrl,
          object_id: selectedIndex,
          correct_label: invalidBox ? "invalid" : formData.classLabel,
          note: formData.note,
        }),
      });

      if (res.ok) {
        toast.success("Feedback submitted successfully!");

        // Reset form
        setFormData({
          type: selectedResult?.type || "",
          classLabel: selectedResult?.class_label || "",
          confidence: selectedResult?.confidence || 0,
          note: "",
        });
        setInvalidBox(false);
      } else {
        toast.error("Submit failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending feedback.");
    }
  };

  if (!selectedResult) return <div>No result found!</div>;

  return (
    <div className="border-inherit p-6 rounded-xl bg-white shadow-md w-full max-w-lg relative">
      <ToastContainer position="top-center" autoClose={3000} />

      <h3 className="text-lg font-roboto font-bold mb-4 text-blue-700 text-center">
        Feedback for Box #{selectedIndex}
      </h3>

      <div className="mb-4">
        <label className="text-sm font-roboto font-medium block mb-1 text-gray-700">
          Choose Box
        </label>
        <select
          value={selectedIndex}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {results.map((r) => (
            <option key={r.index} value={r.index}>
              Box #{r.index}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-2">
        If the box is incorrect or there is no object, please check 'Mark this
        box as invalid'.
      </p>

      <div className="mb-3">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={invalidBox}
            onChange={handleInvalidChange}
            className="mr-2"
          />
          Mark this box as invalid / no object
        </label>
      </div>

      <div className="mb-3">
        <label className="text-sm font-roboto font-medium block mb-1 text-gray-700">
          Type
        </label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          disabled={invalidBox}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            invalidBox ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div className="mb-3">
        <label className="text-sm font-roboto font-medium block mb-1 text-gray-700">
          Class Label
        </label>
        <input
          type="text"
          name="classLabel"
          value={formData.classLabel}
          onChange={handleChange}
          disabled={invalidBox}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            invalidBox ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div className="mb-3">
        <label className="text-sm font-roboto font-medium block mb-1 text-gray-700">
          Confidence
        </label>
        <input
          type="number"
          name="confidence"
          step="0.01"
          value={formData.confidence}
          onChange={handleChange}
          disabled={invalidBox}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            invalidBox ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div className="mb-3">
        <label className="text-sm font-roboto font-medium block mb-1 text-gray-700">
          Note
        </label>
        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleChange}
          className="w-full font-roboto border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 bg-blue-600 text-white font-roboto font-semibold py-2 rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </div>
  );
}
