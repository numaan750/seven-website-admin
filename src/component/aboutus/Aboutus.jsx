"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const Aboutus = () => {
  const { getAboutus, createAboutus, updateAboutus, deleteAboutus } =
    useContext(Appcontext);

  const emptyForm = {
    mainimg: "",
    toptext: "",
    heading: "",
    paragraph: "",
    smaltext: "",
    number1: "",
    p1: "",
    number2: "",
    p2: "",
  };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [IsEditMode, setIsEditMode] = useState(false);
  const [AboutusId, setAboutusId] = useState(null);

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
    const loadAboutusId = async () => {
      try {
        const res = await getAboutus();
        const AboutusData = Array.isArray(res) ? res[0] : res;

        if (AboutusData) {
          setAboutusId(AboutusData._id);
          setIsEditMode(true);
        }
      } catch (err) {
        console.error("Failed to fetch AboutusId:", err);
      }
    };

    loadAboutusId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadForEdit = async () => {
    if (!AboutusId) return;

    try {
      const allAboutus = await getAboutus();
      const Aboutus = allAboutus.find((a) => a._id === AboutusId);

      if (Aboutus) {
        setFormData({
          mainimg: Aboutus.mainimg || "",
          toptext: Aboutus.toptext || "",
          heading: Aboutus.heading || "",
          paragraph: Aboutus.paragraph || "",
          smaltext: Aboutus.smaltext || "",
          number1: Aboutus.number1 || "",
          p1: Aboutus.p1 || "",
          number2: Aboutus.number2 || "",
          p2: Aboutus.p2 || "",
        });
      }
    } catch (err) {
      console.error("Failed to load aboutus data for edit:", err);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let res;

      if (IsEditMode && AboutusId) {
        res = await updateAboutus(AboutusId, formData);
        if (res) {
          alert("Aboutus section updated successfully!");

          setFormData({ ...emptyForm });
        }
      } else {
        res = await createAboutus(formData);
        if (res) {
          alert(
            "Aboutus section created successfully! You can now update or delete it."
          );

          setFormData({ ...emptyForm });
          setAboutusId(res._id);
          setIsEditMode(true);
        }
      }
    } catch (err) {
      console.error("Error submitting Aboutus section:", err);
      alert("Something went wrong. Check the console for details.");
    }
  };

  const handleDelete = async () => {
    if (!AboutusId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this Aboutus section?"))
      return;
    try {
      const res = await deleteAboutus(AboutusId);
      if (res?._id) {
        setFormData({ ...emptyForm });
        setAboutusId(null);
        setIsEditMode(false);
        alert("About section deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting About section:", err);
      alert("Failed to delete About section");
    }
  };

  return (
    <div className="w-full h-screen bg-blue-950 overflow-auto">
      <div className="w-full max-w-full mx-auto p-6">
        <form
          onSubmit={submitForm}
          className="bg-white shadow-md rounded-lg p-6 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-gray-900">
            {IsEditMode ? "Edit About us" : "Create Aboutus"}
          </h1>

          <input
            type="text"
            name="toptext"
            value={formData.toptext}
            onChange={handleInputChange}
            placeholder="Enter top text"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleInputChange}
            placeholder="Enter main heading"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <textarea
            name="paragraph"
            value={formData.paragraph}
            onChange={handleInputChange}
            placeholder="Enter paragraph"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            name="smaltext"
            value={formData.smaltext}
            onChange={handleInputChange}
            placeholder="Enter small text"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="number"
            name="number1"
            value={formData.number1}
            onChange={handleInputChange}
            placeholder="Enter number"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            name="p1"
            value={formData.p1}
            onChange={handleInputChange}
            placeholder="Enter text"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="number"
            name="number2"
            value={formData.number2}
            onChange={handleInputChange}
            placeholder="Enter number"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            name="p2"
            value={formData.p2}
            onChange={handleInputChange}
            placeholder="Enter button text"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image
            </label>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "mainimg")}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                name="mainimg"
                value={formData.mainimg || ""}
                onChange={handleInputChange}
                placeholder="Image URL will appear here..."
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {formData.mainimg && (
              <img
                src={formData.mainimg}
                alt="Preview"
                className="w-24 h-24 mt-2 object-cover border rounded"
              />
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="w-[30%] bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {AboutusId ? "Update About" : "Save Aboutus Section"}
            </button>
            {AboutusId && (
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
                  Delete Aboutus
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Aboutus;
