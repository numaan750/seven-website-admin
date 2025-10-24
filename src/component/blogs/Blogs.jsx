"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const Blogs = () => {
  const { getblogs, createblogs, updateblogs, deleteblogs } =
    useContext(Appcontext);

  const emptyForm = {
    toptext: "",
    mainheading: "",

    card1img: "",
    card1heading: "",
    card1button1: "",
    card1button2: "",
    card1date: "",

    card2img: "",
    card2heading: "",
    card2button: "",
    card2date: "",

    card3img: "",
    card3heading: "",
    card3button: "",
    card3date: "",

    card4img: "",
    card4heading: "",
    card4button1: "",
    card4button2: "",
    card4date: "",
  };

  const [blogsId, setblogsId] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [IsEditMode, setIsEditMode] = useState(false);
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

  const loadBlogsData = async () => {
    try {
      setLoading(true);
      const res = await getblogs();
      const blogsData = Array.isArray(res) ? res[0] : res;

      if (blogsData) {
        setblogsId(blogsData._id);
        setIsEditMode(true);
        setFormData({
          ...emptyForm,
          ...blogsData,
        });
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogsData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (IsEditMode && blogsId) {
        await updateblogs(blogsId, formData);
      } else {
        const res = await createblogs(formData);
        if (res?._id) {
          setblogsId(res._id);
          setIsEditMode(true);
        }
      }
      await loadBlogsData();
    } catch (err) {
      console.error("Error submitting blogs section:", err);
      alert("Failed to save blogs section");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!blogsId) return alert("Nothing to delete");

    const confirmed = window.confirm(
      "Are you sure you want to delete this Blogs section?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteblogs(blogsId);
      setFormData({ ...emptyForm });
      setblogsId(null);
      setIsEditMode(false);
      alert("Blogs section deleted successfully!");
    } catch (err) {
      console.error("Error deleting blogs section:", err);
      alert("Failed to delete blogs section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 py-10 flex justify-center items-center">
      <div className="w-full max-w-full mx-auto px-6">
        <div className="bg-white shadow-lg rounded-xl p-8 relative min-h-[500px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 bg-white/80 backdrop-blur-sm z-10">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-blue-700 font-semibold">Processing...</p>
            </div>
          ) : (
            <form
              onSubmit={submitForm}
              className="w-full space-y-6 overflow-y-auto max-h-[85vh] p-2"
            >
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                {IsEditMode ? "Edit Blogs Section" : "Create Blogs Section"}
              </h1>

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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Main Heading
                </label>
                <input
                  type="text"
                  name="mainheading"
                  value={formData.mainheading}
                  onChange={handleInputChange}
                  placeholder="Enter main heading"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-800">Card 1</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="card1heading"
                    value={formData.card1heading}
                    onChange={handleInputChange}
                    placeholder="Card 1 Heading"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    name="card1date"
                    value={formData.card1date}
                    onChange={handleInputChange}
                    placeholder="Card 1 Date"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "card1img")}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    name="card1img"
                    value={formData.card1img}
                    onChange={handleInputChange}
                    placeholder="Card 1 Image URL"
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {formData.card1img && (
                  <img
                    src={formData.card1img}
                    alt="Preview"
                    className="w-24 h-24 mt-2 object-cover border rounded"
                  />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    name="card1button1"
                    value={formData.card1button1}
                    onChange={handleInputChange}
                    placeholder="Button 1 Text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    name="card1button2"
                    value={formData.card1button2}
                    onChange={handleInputChange}
                    placeholder="Button 2 Text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-800">Card 2</h2>
                <input
                  type="text"
                  name="card2heading"
                  value={formData.card2heading}
                  onChange={handleInputChange}
                  placeholder="Card 2 Heading"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="card2button"
                  value={formData.card2button}
                  onChange={handleInputChange}
                  placeholder="Card 2 Button"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="card2date"
                  value={formData.card2date}
                  onChange={handleInputChange}
                  placeholder="Card 2 Date"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex items-center gap-2 mt-2">
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "card2img")}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    name="card2img"
                    value={formData.card2img}
                    onChange={handleInputChange}
                    placeholder="Card 2 Image URL"
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {formData.card2img && (
                  <img
                    src={formData.card2img}
                    alt="Preview"
                    className="w-24 h-24 mt-2 object-cover border rounded"
                  />
                )}
              </div>

              <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-800">Card 3</h2>
                <input
                  type="text"
                  name="card3heading"
                  value={formData.card3heading}
                  onChange={handleInputChange}
                  placeholder="Card 3 Heading"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="card3button"
                  value={formData.card3button}
                  onChange={handleInputChange}
                  placeholder="Card 3 Button"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="card3date"
                  value={formData.card3date}
                  onChange={handleInputChange}
                  placeholder="Card 3 Date"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex items-center gap-2 mt-2">
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Upload
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
                    value={formData.card3img}
                    onChange={handleInputChange}
                    placeholder="Card 3 Image URL"
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
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

              <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-800">Card 4</h2>
                <input
                  type="text"
                  name="card4heading"
                  value={formData.card4heading}
                  onChange={handleInputChange}
                  placeholder="Card 4 Heading"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="card4date"
                  value={formData.card4date}
                  onChange={handleInputChange}
                  placeholder="Card 4 Date"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex items-center gap-2 mt-2">
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "card4img")}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    name="card4img"
                    value={formData.card4img}
                    onChange={handleInputChange}
                    placeholder="Card 4 Image URL"
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {formData.card4img && (
                  <img
                    src={formData.card4img}
                    alt="Preview"
                    className="w-24 h-24 mt-2 object-cover border rounded"
                  />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    name="card4button1"
                    value={formData.card4button1}
                    onChange={handleInputChange}
                    placeholder="Button 1 Text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    name="card4button2"
                    value={formData.card4button2}
                    onChange={handleInputChange}
                    placeholder="Button 2 Text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="w-[25%] bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  {IsEditMode ? "Update" : "Create"}
                </button>

                {IsEditMode && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-[25%] bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all"
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

export default Blogs;
