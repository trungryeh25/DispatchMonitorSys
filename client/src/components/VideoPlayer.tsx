"use client";

export default function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  return (
    <div className="w-full border rounded shadow">
      <video controls width="100%">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support video.
      </video>
    </div>
  );
}
