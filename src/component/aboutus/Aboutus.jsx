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
    const loadAboutusId = async () => {
      try {
        setLoading(true);
        const res = await getAboutus();
        const AboutusData = Array.isArray(res) ? res[0] : res;

        if (AboutusData) {
          setAboutusId(AboutusData._id);
          setIsEditMode(true);
          setFormData({
            mainimg: AboutusData.mainimg || "",
            toptext: AboutusData.toptext || "",
            heading: AboutusData.heading || "",
            paragraph: AboutusData.paragraph || "",
            smaltext: AboutusData.smaltext || "",
            number1: AboutusData.number1 || "",
            p1: AboutusData.p1 || "",
            number2: AboutusData.number2 || "",
            p2: AboutusData.p2 || "",
          });
          setPreviewImg(AboutusData.mainimg || ""); 
        }
      } catch (err) {
        console.error("Failed to fetch Aboutus:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAboutusId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (IsEditMode && AboutusId) {
        await updateAboutus(AboutusId, formData);
      } else {
        const res = await createAboutus(formData);
        if (res?._id) {
          setAboutusId(res._id);
          setIsEditMode(true);
        }
      }

      setFormData((prev) => ({ ...prev, mainimg: "" }));
    } catch (err) {
      console.error("Error submitting Aboutus section:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!AboutusId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this Aboutus section?"))
      return;

    setLoading(true);
    try {
      await deleteAboutus(AboutusId);
      alert("About section deleted successfully!");
      setFormData({ ...emptyForm });
      setAboutusId(null);
      setIsEditMode(false);
      setPreviewImg(""); 
    } catch (err) {
      console.error("Error deleting About section:", err);
      alert("Failed to delete About section");
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
                {IsEditMode ? "Edit About Us" : "Create About Us"}
              </h1>

              {[
                "toptext",
                "heading",
                "paragraph",
                "smaltext",
                "number1",
                "p1",
                "number2",
                "p2",
              ].map((field, idx) =>
                field === "paragraph" ? (
                  <textarea
                    key={idx}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${field}`}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <input
                    key={idx}
                    type={field.includes("number") ? "number" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${field}`}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                )
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    {uploading ? "Uploading..." : "Upload File"}
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
                    value={formData.mainimg}
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
                  className="w-[25%] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  {IsEditMode ? "Update About" : "Create About"}
                </button>

                {IsEditMode && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-[25%] bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Delete About
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

export default Aboutus;
