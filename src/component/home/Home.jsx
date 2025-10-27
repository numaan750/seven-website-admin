"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const Home = () => {
  const { getHome, createHome, updateHome, deleteHome } =
    useContext(Appcontext);

  const emptyForm = {
    backgroundimg: "",
    heading: "",
    paragraph: "",
    buttontext1: "",
    buttontext2: "",
  };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [IsEditMode, setIsEditMode] = useState(false);
  const [HomeId, setHomeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImg, setPreviewImg] = useState("");

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const CLOUD_NAME = "dhtpqla2b";
    const UPLOAD_PRESET = "unsigned_preset";

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadForm,
        }
      );
      const data = await res.json();

      setFormData((prev) => ({ ...prev, [fieldName]: data.secure_url }));
      setPreviewImg(data.secure_url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const res = await getHome();
        const homeData = Array.isArray(res) ? res[0] : res;
        if (homeData) {
          setHomeId(homeData._id);
          setIsEditMode(true);
          setFormData({
            backgroundimg: homeData.backgroundimg || "",
            heading: homeData.heading || "",
            paragraph: homeData.paragraph || "",
            buttontext1: homeData.buttontext1 || "",
            buttontext2: homeData.buttontext2 || "",
          });
          setPreviewImg(homeData.backgroundimg || "");
        }
      } catch (err) {
        console.error("Failed to fetch Home data:", err);
      }
    };
    loadHomeData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (IsEditMode && HomeId) {
        const updated = await updateHome(HomeId, formData);
        if (updated) {
          // refresh current form state with new backend data
          setFormData((prev) => ({
            ...prev,
            ...updated, // merge updated fields
          }));
        }
      } else {
        const res = await createHome(formData);
        if (res?._id) {
          setHomeId(res._id);
          setIsEditMode(true);
          setFormData((prev) => ({
            ...prev,
            ...res, // merge created document back into form
          }));
        }
      }
    } catch (err) {
      console.error("Error submitting Home section:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!HomeId) return alert("Nothing to delete!");
    if (!confirm("Are you sure you want to delete this Home section?")) return;

    setLoading(true);
    try {
      await deleteHome(HomeId);
      alert("Home section deleted successfully!");
      setFormData({ ...emptyForm });
      setHomeId(null);
      setIsEditMode(false);
      setPreviewImg("");
    } catch (err) {
      console.error("Error deleting Home section:", err);
      alert("Failed to delete Home section!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 py-8 overflow-y-auto flex items-center justify-center">
      <div className="max-w-full mx-auto px-6 w-full">
        <div className="w-full bg-white shadow-md rounded-lg p-6 relative min-h-[500px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-blue-700 font-semibold">Processing...</p>
            </div>
          ) : (
            <form onSubmit={submitForm} className="w-full space-y-5">
              <h1 className="text-3xl font-bold text-center text-gray-900">
                {IsEditMode ? "Edit Home" : "Create Home"}
              </h1>

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
                  className="w-full p-3 border border-gray-300 rounded-lg"
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
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Button text 1
                  </label>
                  <input
                    type="text"
                    name="buttontext1"
                    value={formData.buttontext1}
                    onChange={handleInputChange}
                    placeholder="Button text 1"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Button text 2
                  </label>
                  <input
                    type="text"
                    name="buttontext2"
                    value={formData.buttontext2}
                    onChange={handleInputChange}
                    placeholder="Button text 2"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    {uploading ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "backgroundimg")}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    name="backgroundimg"
                    value={formData.backgroundimg}
                    onChange={handleInputChange}
                    placeholder="Image URL will appear here..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {previewImg && (
                  <img
                    src={previewImg}
                    alt="Preview"
                    className="w-24 h-24 mt-2 object-cover border rounded"
                  />
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="w-[20%] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  {IsEditMode ? "Update Home" : "Create Home"}
                </button>

                {IsEditMode && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-[20%] bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Delete Home
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

export default Home;
