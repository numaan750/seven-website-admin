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
    const loadblogsId = async () => {
      try {
        const res = await getblogs();
        const blogsData = Array.isArray(res) ? res[0] : res;

        if (blogsData) {
          setblogsId(blogsData._id);
          setIsEditMode(true);
        }
      } catch (err) {
        console.error("Failed to fetch blogsId:", err);
      }
    };

    loadblogsId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadForEdit = async () => {
    if (!blogsId) return;

    try {
      const allblogs = await getblogs();
      const blogs = allblogs.find((b) => b._id === blogsId);

      if (blogs) {
        setFormData({
          toptext: blogs.toptext || "",
          mainheading: blogs.mainheading || "",

          card1img: blogs.card1img || "",
          card1heading: blogs.card1heading || "",
          card1button1: blogs.card1button1 || "",
          card1button2: blogs.card1button2 || "",
          card1date: blogs.card1date || "",

          card2img: blogs.card2img || "",
          card2heading: blogs.card2heading || "",
          card2button: blogs.card2button || "",
          card2date: blogs.card2date || "",

          card3img: blogs.card3img || "",
          card3heading: blogs.card3heading || "",
          card3button: blogs.card3button || "",
          card3date: blogs.card3date || "",

          card4img: blogs.card4img || "",
          card4heading: blogs.card4heading || "",
          card4button1: blogs.card4button1 || "",
          card4button2: blogs.card4button2 || "",
          card4date: blogs.card4date || "",
        });
      }
    } catch (err) {
      console.error("Failed to load blogs data for edit:", err);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let res;

      if (IsEditMode && blogsId) {
        res = await updateblogs(blogsId, formData);
        if (res) {
          alert("blogs section updated successfully!");
          setFormData({ ...emptyForm });
        }
      } else {
        res = await createblogs(formData);
        if (res) {
          alert(
            "blogs section created successfully! You can now update or delete it."
          );

          setFormData({ ...emptyForm });
          setblogsId(res._id);
          setIsEditMode(true);
        }
      }
    } catch (err) {
      console.error("Error submitting blogs section:", err);
      alert("Something went wrong. Check the console for details.");
    }
  };

  const handleDelete = async () => {
    if (!blogsId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this blogs section?")) return;

    try {
      const res = await deleteblogs(blogsId);
      if (res?._id) {
        setFormData({ ...emptyForm });
        setblogsId(null);
        setIsEditMode(false);
        alert("blogs section deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting blogs section:", err);
      alert("Failed to delete blogs section");
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 overflow-auto">
      <div className="w-full max-w-5xl mx-auto p-6">
        <form
          onSubmit={submitForm}
          className="bg-white shadow-md rounded-lg p-6 space-y-8"
        >
          <h1 className="text-3xl font-bold text-center text-gray-900">
            {IsEditMode ? "Edit blogs" : "Create blogs"}
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
            Cards Section
          </h2>

          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <h3 className="text-md font-semibold text-gray-700">Card 1</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card 1 Image
              </label>

              <div className="flex items-center gap-2">
                {/* File Upload Button */}
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
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
                  placeholder="https://example.com/image1.jpg"
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

            <input
              type="text"
              name="card1heading"
              value={formData.card1heading}
              onChange={handleInputChange}
              placeholder="Enter card heading"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="card1button1"
                value={formData.card1button1}
                onChange={handleInputChange}
                placeholder="Enter button text 1"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="card1button2"
                value={formData.card1button2}
                onChange={handleInputChange}
                placeholder="Enter button text 2"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <input
              type="text"
              name="card1date"
              value={formData.card1date}
              onChange={handleInputChange}
              placeholder="e.g. January 16, 2025"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <h3 className="text-md font-semibold text-gray-700">Card 2</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card 2 Image
              </label>

              <div className="flex items-center gap-2">
                {/* File Upload Button */}
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
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
                  placeholder="https://example.com/image2.jpg"
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

            <input
              type="text"
              name="card2heading"
              value={formData.card2heading}
              onChange={handleInputChange}
              placeholder="Enter card heading"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              name="card2button"
              value={formData.card2button}
              onChange={handleInputChange}
              placeholder="Enter button text"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              name="card2date"
              value={formData.card2date}
              onChange={handleInputChange}
              placeholder="e.g. January 16, 2025"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <h3 className="text-md font-semibold text-gray-700">Card 3</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card 3 Image
              </label>

              <div className="flex items-center gap-2">
                {/* File Upload Button */}
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "card3img")}
                    className="hidden"
                  />
                </label>

                {/* URL Input */}
                <input
                  type="text"
                  name="card3img"
                  value={formData.card3img || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image3.jpg"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Image Preview */}
              {formData.card3img && (
                <img
                  src={formData.card3img}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover border rounded"
                />
              )}
            </div>

            <input
              type="text"
              name="card3heading"
              value={formData.card3heading}
              onChange={handleInputChange}
              placeholder="Enter card heading"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              name="card3button"
              value={formData.card3button}
              onChange={handleInputChange}
              placeholder="Enter button text"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              name="card3date"
              value={formData.card3date}
              onChange={handleInputChange}
              placeholder="e.g. January 16, 2025"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <h3 className="text-md font-semibold text-gray-700">Card 4</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card 4 Image
              </label>

              <div className="flex items-center gap-2">
                {/* File Upload Button */}
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "card4img")}
                    className="hidden"
                  />
                </label>

                {/* URL Input */}
                <input
                  type="text"
                  name="card4img"
                  value={formData.card4img || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image4.jpg"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Image Preview */}
              {formData.card4img && (
                <img
                  src={formData.card4img}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover border rounded"
                />
              )}
            </div>

            <input
              type="text"
              name="card4heading"
              value={formData.card4heading}
              onChange={handleInputChange}
              placeholder="Enter card heading"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="card4button1"
                value={formData.card4button1}
                onChange={handleInputChange}
                placeholder="Enter button text 1"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="card4button2"
                value={formData.card4button2}
                onChange={handleInputChange}
                placeholder="Enter button text 2"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <input
              type="text"
              name="card4date"
              value={formData.card4date}
              onChange={handleInputChange}
              placeholder="e.g. January 16, 2025"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="w-[30%] bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {blogsId ? "Update blog" : "Save blog Section"}
            </button>

            {blogsId && (
              <>
                <button
                  type="button"
                  onClick={loadForEdit}
                  className="w-[20%] bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Load for Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-[20%] bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Blogs;
