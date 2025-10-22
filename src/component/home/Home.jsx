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
    const loadHomeId = async () => {
      try {
        const res = await getHome();
        const homeData = Array.isArray(res) ? res[0] : res;

        if (homeData) {
          setHomeId(homeData._id);
          setIsEditMode(true);
        }
      } catch (err) {
        console.error("Failed to fetch HomeId:", err);
      }
    };

    loadHomeId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadForEdit = async () => {
    if (!HomeId) return;

    try {
      const allHomes = await getHome(); // agar array return hota hai
      const home = allHomes.find((h) => h._id === HomeId);

      if (home) {
        setFormData({
          backgroundimg: home.backgroundimg || "",
          heading: home.heading || "",
          paragraph: home.paragraph || "",
          buttontext1: home.buttontext1 || "",
          buttontext2: home.buttontext2 || "",
        });
      }
    } catch (err) {
      console.error("Failed to load home data for edit:", err);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let res;

      if (IsEditMode && HomeId) {
        res = await updateHome(HomeId, formData);
        if (res) {
          alert("Home section updated successfully!");

          setFormData({ ...emptyForm });
        }
      } else {
        res = await createHome(formData);
        if (res) {
          alert(
            "Home section created successfully! You can now update or delete it."
          );
          setFormData({ ...emptyForm });
          setHomeId(res._id);
          setIsEditMode(true);
        }
      }
    } catch (err) {
      console.error("Error submitting Home section:", err);
      alert("Something went wrong. Check the console for details.");
    }
  };

  const handleDelete = async () => {
    if (!HomeId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this Home section?")) return;

    try {
      const res = await deleteHome(HomeId);
      if (res?._id) {
        setFormData({ ...emptyForm });
        setHomeId(null);
        setIsEditMode(false);
        alert("Home section deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting Home section:", err);
      alert("Failed to delete Home section");
    }
  };

  return (
    <div className="w-full h-screen bg-blue-950 overflow-auto">
      <div className="w-full max-w-full mx-auto p-6">
        <form
          onSubmit={submitForm}
          className="bg-white shadow-md rounded-lg p-6 space-y-4"
        >
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
                Upload File
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

            {formData.backgroundimg && (
              <img
                src={formData.backgroundimg}
                alt="Preview"
                className="w-24 h-24 mt-2 object-cover border rounded"
              />
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="w-[30%] bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {HomeId ? "Update Home" : "Save Hero Section"}
            </button>

            {HomeId && (
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
                  Delete Home
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
