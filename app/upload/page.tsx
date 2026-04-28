"use client";

import { useState, useRef, ChangeEvent } from "react";
import { storage } from "../components/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function PhotoUpload() {
  const [teamNumber, setTeamNumber] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setUploadStatus("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const filesArray = Array.from(e.dataTransfer.files);
    setSelectedFiles(filesArray);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!teamNumber.trim()) {
      setUploadStatus("Add team number dummy");
      return;
    }

    if (selectedFiles.length === 0) {
      setUploadStatus("Add the photos dummy");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus("");

    try {
      const successfulUploads: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileName = teamNumber + "_" + (i + 1) + ".jpg";
        const storageRef = ref(storage, fileName);

        try {
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          successfulUploads.push(downloadURL);

              setUploadProgress(i + 1);
        } catch (error) {
          console.error("Error uploading " + fileName + ":", error);
          setUploadStatus("Error uploading " + fileName + ", check your internet b4 msging me");
          setUploading(false);
          return;
        }
      }

      setUploadStatus(
        "Uploaded " + successfulUploads.length + " photos for team " + teamNumber
      );
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("upld error:", error);
      setUploadStatus("error occurred try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">

        <div className="bg-gray-900 p-6 shadow-lg">
          <div className="mb-6">
            <label htmlFor="teamNumber" className="block text-sm font-medium text-gray-300 mb-2">
              Team Number
            </label>
            <input
              type="text"
              id="teamNumber"
              value={teamNumber}
              onChange={(e) => setTeamNumber(e.target.value)}
              placeholder="#"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Photos
            </label>
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={uploading}
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <p className="mt-2 text-sm text-gray-400">
                or drag and drop (weirdly inconsistent idk why)
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">
                  Selected files: {selectedFiles.length}
                </p>
                <div className="max-h-32 overflow-y-auto bg-gray-700 rounded p-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="text-sm text-gray-300 py-1">
                      {teamNumber ? teamNumber + "_" + (index + 1) + ".jpg" : " Photo " + (index + 1)}
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0 || !teamNumber}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Photos"}
          </button>

          {uploading && selectedFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 text-center">
                Uploading: {uploadProgress}/{selectedFiles.length}
              </p>
            </div>
          )}

          {uploadStatus && (
            <div
              className={"mt-4 p-3 rounded-lg text-center " + (
                uploadStatus.includes("Error")
                  ? "bg-red-900 text-red-200"
                  : "bg-green-900 text-green-200"
              )}
            >
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
