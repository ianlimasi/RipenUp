"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [fruitName, setFruitName] = useState("");
  const [isSliced, setIsSliced] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);

  // Generate preview URL whenever file changes
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Clean up the URL when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    if (!fruitName) {
      alert("Please enter the fruit name");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("fruit_name", fruitName); // new
    formData.append("is_sliced", isSliced.toString()); // new

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setResult(errorData.error || "Something went wrong");
        return;
      }

      const data = await res.json();
      setResult(data.text || "No result returned");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResult(err.message);
      } else {
        setResult("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Fruit name input */}
        <input
          type="text"
          placeholder="Enter fruit name"
          value={fruitName}
          onChange={(e) => setFruitName(e.target.value)}
          className="px-2 py-1 border rounded"
        />

        {/* File input */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {/* Image preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 max-h-60 object-contain border rounded"
          />
        )}


        {/* Sliced toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSliced}
            onChange={(e) => setIsSliced(e.target.checked)}
          />
          Is the fruit sliced?
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {result && renderResult(result)}

    </div>
  );
}

// Helper function to render the AI result
const renderResult = (result: string) => {
    const cleaned = result.replace(/```json\s*|```/g, '').trim();
    const json = JSON.parse(cleaned);
    return (
      <div>
        <div className="mt-4 p-4 bg-gray-100 rounded space-y-2">
          <p><strong>Predicted Ripeness:</strong> {json.predicted_ripeness}</p>
          <p><strong>Confidence:</strong> {json.confidence}%</p>
          <p><strong>Note:</strong> {json.note}</p>
        </div>
        <RipenessBar stage={json.predicted_ripeness.toLowerCase()} />
      </div>
    );
};

const RipenessBar = ({
  stage,
}: {
  stage: "underripe" | "early ripe" | "ripe" | "overripe";
}) => {
  // Map stage to percentage
  const stageMap: Record<string, number> = {
    underripe: 12.5,   // middle of green segment
    "early ripe": 37.5, // middle of yellow
    ripe: 62.5,        // middle of orange
    overripe: 87.5,    // middle of red
  };

  const position = stageMap[stage] || 0;

  return (
    <div className="mt-4 w-full h-6 bg-gray-300 rounded overflow-hidden relative">
      {/* Segmented colors */}
      <div className="absolute top-0 left-0 h-full w-1/4 bg-green-500"></div>
      <div className="absolute top-0 left-1/4 h-full w-1/4 bg-yellow-400"></div>
      <div className="absolute top-0 left-1/2 h-full w-1/4 bg-orange-400"></div>
      <div className="absolute top-0 left-3/4 h-full w-1/4 bg-red-500"></div>

      {/* Marker */}
      <div
        className="absolute top-0 h-full w-1.5 bg-black"
        style={{ left: `calc(${position}% - 0.1875rem)` }}
      ></div>
    </div>
  );
};

