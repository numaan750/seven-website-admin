"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const Componies = () => {
  const { getcomponies, createcomponies, updatecomponies, deletecomponies } =
    useContext(Appcontext);

  const emptyForm = {
    heading: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    img5: "",
    img6: "",
  };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [componiesId, setcomponiesId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const CLOUD_NAME = "dhtpqla2b";
    const UPLOAD_PRESET = "unsigned_preset";

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("upload_preset", UPLOAD_PRESET);

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadForm,
        }
      );

      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        [fieldName]: data.secure_url,
      }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const loadComponiesData = async () => {
      try {
        setLoading(true);
        const res = await getcomponies();
        const componiesData = Array.isArray(res) ? res[0] : res;

        if (componiesData) {
          setcomponiesId(componiesData._id);
          setIsEditMode(true);
          setFormData({
            heading: componiesData.heading || "",
            img1: componiesData.img1 || "",
            img2: componiesData.img2 || "",
            img3: componiesData.img3 || "",
            img4: componiesData.img4 || "",
            img5: componiesData.img5 || "",
            img6: componiesData.img6 || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch componies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadComponiesData();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode && componiesId) {
        await updatecomponies(componiesId, formData);
      } else {
        const res = await createcomponies(formData);
        if (res?._id) {
          setcomponiesId(res._id);
          setIsEditMode(true);
        }
      }
    } catch (err) {
      console.error("Error submitting componies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!componiesId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this section?")) return;

    setLoading(true);
    try {
      await deletecomponies(componiesId);
      setFormData({ ...emptyForm });
      setcomponiesId(null);
      setIsEditMode(false);
      alert("Companies section deleted successfully!");
    } catch (err) {
      console.error("Error deleting componies:", err);
      alert("Failed to delete companies section!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 overflow-auto py-10 flex justify-center items-center">
      <div className="w-full max-w-full mx-auto px-6 h-screen">
        <div className="bg-white shadow-lg rounded-xl p-8 relative min-h-[500px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-blue-700 font-semibold">Processing...</p>
            </div>
          ) : (
            <form onSubmit={submitForm} className="w-full space-y-6">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                {isEditMode ? "Edit Companies" : "Create Companies"}
              </h1>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Main Heading
                </label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  placeholder="Enter main heading"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {["img1", "img2", "img3", "img4", "img5", "img6"].map(
                (imgKey, index) => (
                  <div key={imgKey} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image {index + 1}
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Upload File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, imgKey)}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        name={imgKey}
                        value={formData[imgKey]}
                        onChange={handleInputChange}
                        placeholder="Image URL will appear here..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    {formData[imgKey] && (
                      <img
                        src={formData[imgKey]}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 mt-2 object-cover border rounded"
                      />
                    )}
                  </div>
                )
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="w-[20%] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  {isEditMode ? "Update" : "Create"}
                </button>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-[20%] bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Componies;
