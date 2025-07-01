"use client";

import api from "@/utils/api";

export default function ControlButtons() {
  const updateDataset = async () => {
    await api.post("/update_dataset");
    alert("Dataset updated from feedback!");
  };

  const retrainModel = async () => {
    await api.post("/retrain");
    alert("Model retraining started!");
  };

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={updateDataset}
        className="bg-yellow-600 text-white px-4 py-2 rounded"
      >
        Update Dataset
      </button>
      <button
        onClick={retrainModel}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Retrain Model
      </button>
    </div>
  );
}
