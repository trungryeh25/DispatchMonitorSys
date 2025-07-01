"use client";

import ImageUpload from "@/components/ImageUpload";

export default function ImagePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-roboto font-bold mb-6 mt-6 text-center">
        PREDICT
      </h1>
      <ImageUpload />
    </div>
  );
}
