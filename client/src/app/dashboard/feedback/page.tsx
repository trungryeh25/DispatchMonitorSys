"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";

interface FeedbackItem {
  id: string;
  image_id: string;
  object_id: string;
  correct_label: string;
  timestamp?: string;
}

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get("/feedback");
        setFeedbackList(res.data.feedback || []);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleRetrain = async () => {
    try {
      await api.post("/retrain");
      alert("Retraining started successfully!");
    } catch (error) {
      console.error("Error retraining:", error);
      alert("Error while starting retrain");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-roboto font-bold mb-6 mt-6 text-center">
        Feedback Page
      </h1>
      <p className="font-roboto text-center">
        Feature is still in progress.{" "}
        <span className="inline-block animate-spin">🚀</span>
      </p>
      <button
        onClick={handleRetrain}
        className="border p-4 mb-4 px-4 py-2 bg-green-600 font-roboto text-white rounded"
      >
        Retrain Models
      </button>

      {loading ? (
        <p>Loading feedback...</p>
      ) : feedbackList.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        <ul className="space-y-4 font-roboto">
          {feedbackList.map((item, index) => (
            <form
              key={index}
              className="border font-roboto p-4 rounded bg-white shadow"
            >
              <p>
                <strong>Image ID:</strong> {item.image_id}
              </p>
              <p>
                <strong>Object ID:</strong> {item.object_id}
              </p>
              <p>
                <strong>Correct Label:</strong> {item.correct_label}
              </p>
              {item.timestamp && (
                <p>
                  <strong>Time:</strong> {item.timestamp}
                </p>
              )}
            </form>
          ))}
        </ul>
      )}
    </>
  );
}
