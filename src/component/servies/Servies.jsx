"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const Servies = () => {
  const { getServies, createServies, updateServies, deleteServies } =
    useContext(Appcontext);
    

  const emptyForm = {
    toptext: "",
    heading: "",
    paragraph: "",
    card1img: "",
    card1heading: "",
    card1paragraph: "",
    card2img: "",
    card2heading: "",
    card2paragraph: "",
    card3img: "",
    card3heading: "",
    card3paragraph: "",
  };

  const [ServiesId, setServiesId] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [IsEditMode, setIsEditMode] = useState(false);

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const CLOUD_NAME = "dhtpqla2b";
    const UPLOAD_PRESET = "unsigned_preset";

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadForm,
        }
      );

      const data = await res.json();
      console.log("Uploaded URL:", data.secure_url);

      setFormData((prev) => ({
        ...prev,
        [fieldName]: data.secure_url,
      }));
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  useEffect(() => {
    const loadServiesId = async () => {
      try {
        const res = await getServies();
        const ServiesData = Array.isArray(res) ? res[0] : res;

        if (ServiesData) {
          setServiesId(ServiesData._id);
          setIsEditMode(true);
        }
      } catch (err) {
        console.error("Failed to fetch ServiesId:", err);
      }
    };

    loadServiesId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadForEdit = async () => {
    if (!ServiesId) return;

    try {
      const allServies = await getServies();
      const Servies = allServies.find((s) => s._id === ServiesId);

      if (Servies) {
        setFormData({
          toptext: Servies.toptext || "",
          heading: Servies.heading || "",
          paragraph: Servies.paragraph || "",
          card1img: Servies.card1img || "",
          card1heading: Servies.card1heading || "",
          card1paragraph: Servies.card1paragraph || "",
          card2img: Servies.card2img || "",
          card2heading: Servies.card2heading || "",
          card2paragraph: Servies.card2paragraph || "",
          card3img: Servies.card3img || "",
          card3heading: Servies.card3heading || "",
          card3paragraph: Servies.card3paragraph || "",
        });
      }
    } catch (err) {
      console.error("Failed to load Servies data for edit:", err);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let res;

      if (IsEditMode && ServiesId) {
        res = await updateServies(ServiesId, formData);
        if (res) {
          alert("Servies section updated successfully!");

          setFormData({ ...emptyForm });
        }
      } else {
        res = await createServies(formData);
        if (res) {
          alert(
            "Servies section created successfully! You can now update or delete it."
          );
          setFormData({ ...emptyForm });
          setServiesId(res._id);
          setIsEditMode(true);
        }
      }
    } catch (err) {
      console.error("Error submitting Servies section:", err);
      alert("Something went wrong. Check the console for details.");
    }
  };

  const handleDelete = async () => {
    if (!ServiesId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this Servies section?"))
      return;

    try {
      const res = await deleteServies(ServiesId);
      if (res?._id) {
        setFormData({ ...emptyForm });
        setServiesId(null);
        setIsEditMode(false);
        alert("Servies section deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting Servies section:", err);
      alert("Failed to delete Servies section");
    }
  };

  
  return (
    <div className="w-full min-h-screen bg-blue-950 overflow-auto py-10">
      <div className="w-full max-w-full mx-auto p-6">
        <form
          onSubmit={submitForm}
          className="bg-white shadow-md rounded-lg p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Top Text
            </label>
            <input
              type="text"
              name="toptext"
              value={formData.toptext}
              onChange={handleInputChange}
              placeholder="Enter top text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Main Heading
            </label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              placeholder="Enter main heading"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Paragraph
            </label>
            <textarea
              name="paragraph"
              value={formData.paragraph}
              onChange={handleInputChange}
              placeholder="Enter paragraph text"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">
            Service Cards
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg shadow-sm bg-gray-50 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card 1 Image URL
                </label>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card 1 Image
                  </label>

                  <div className="flex items-center gap-2">
                    {/* File Upload Button */}
                    <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                      uplode
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "card1img")}
                        className="hidden"
                      />
                    </label>

                    {/* URL Input */}
                    <input
                      type="text"
                      name="card1img"
                      value={formData.card1img || ""}
                      onChange={handleInputChange}
                      placeholder="https://example.com/service1.png"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>

                  {/* Image Preview */}
                  {formData.card1img && (
                    <img
                      src={formData.card1img}
                      alt="Preview"
                      className="w-24 h-24 mt-2 object-cover border rounded"
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card 1 Heading
                </label>
                <input
                  type="text"
                  name="card1heading"
                  value={formData.card1heading}
                  onChange={handleInputChange}
                  placeholder="Enter heading"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card 1 Text
                </label>
                <textarea
                  name="card1paragraph"
                  rows="3"
                  value={formData.card1paragraph}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border rounded-lg shadow-sm bg-gray-50 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card 2 Image URL
                </label>
                <div className="flex items-center gap-2">
                  {/* File Upload Button */}
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    uplode
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "card2img")}
                      className="hidden"
                    />
                  </label>

                  {/* URL Input */}
                  <input
                    type="text"
                    name="card2img"
                    value={formData.card2img || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/service1.png"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                {/* Image Preview */}
                {formData.card2img && (
                  <img
                    src={formData.card2img}
                    alt="Preview"
                    className="w-24 h-24 mt-2 object-cover border rounded"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card 2 Heading
                </label>
                <input
                  type="text"
                  name="card2heading"
                  value={formData.card2heading}
                  onChange={handleInputChange}
                  placeholder="Enter heading"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card 2 Text
                </label>
                <textarea
                  name="card2paragraph"
                  rows="3"
                  value={formData.card2paragraph}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border rounded-lg shadow-sm bg-gray-50 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card 3 Image URL
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    uplode
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "card3img")}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    name="card3img"
                    value={formData.card3img || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/service1.png"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                {formData.card3img && (
                  <img
                    src={formData.card3img}
                    alt="Preview"
                    className="w-24 h-24 mt-2 object-cover border rounded"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card 3 Heading
                </label>
                <input
                  type="text"
                  name="card3heading"
                  value={formData.card3heading}
                  onChange={handleInputChange}
                  placeholder="Enter heading"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card 3 Text
                </label>
                <textarea
                  name="card3paragraph"
                  rows="3"
                  value={formData.card3paragraph}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="w-[30%] bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200"
            >
              {ServiesId ? "Update Service" : "Submit Service"}
            </button>

            {ServiesId && (
              <>
                <button
                  type="button"
                  onClick={loadForEdit}
                  className="w-[25%] bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Load for Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-[25%] bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Delete Service
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Servies;
