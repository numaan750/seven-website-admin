"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const ServicesForm = () => {
  const {
    getServies,
    createServies,
    updateServies,
    deleteServies,
  } = useContext(Appcontext);

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

  const [formData, setFormData] = useState({ ...emptyForm });
  const [isEditMode, setIsEditMode] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ NEW: Individual loading state for each upload button
  const [uploading, setUploading] = useState({
    card1img: false,
    card2img: false,
    card3img: false,
  });

  // ✅ Handle Cloudinary Upload (per-button loader)
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const CLOUD_NAME = "dhtpqla2b";
    const UPLOAD_PRESET = "unsigned_preset";

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploading((prev) => ({ ...prev, [fieldName]: true }));
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: uploadForm }
      );
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        [fieldName]: data.secure_url,
      }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  // ✅ Load existing data
  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await getServies();
      const data = Array.isArray(res) ? res[0] : res;

      if (data) {
        setServiceId(data._id);
        setIsEditMode(true);
        setFormData({
          toptext: data.toptext || "",
          heading: data.heading || "",
          paragraph: data.paragraph || "",
          card1img: data.card1img || "",
          card1heading: data.card1heading || "",
          card1paragraph: data.card1paragraph || "",
          card2img: data.card2img || "",
          card2heading: data.card2heading || "",
          card2paragraph: data.card2paragraph || "",
          card3img: data.card3img || "",
          card3heading: data.card3heading || "",
          card3paragraph: data.card3paragraph || "",
        });
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // ✅ Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit form (live updates, no reload)
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode && serviceId) {
        const updated = await updateServies(serviceId, formData);
        if (updated) {
          setFormData((prev) => ({ ...prev, ...updated }));
        }
      } else {
        const res = await createServies(formData);
        if (res?._id) {
          setServiceId(res._id);
          setIsEditMode(true);
          setFormData((prev) => ({ ...prev, ...res }));
        }
      }
    } catch (err) {
      console.error("Error submitting services:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete
  const handleDelete = async () => {
    if (!serviceId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this section?")) return;

    setLoading(true);
    try {
      await deleteServies(serviceId);
      setFormData({ ...emptyForm });
      setServiceId(null);
      setIsEditMode(false);
      alert("Service section deleted successfully!");
    } catch (err) {
      console.error("Error deleting services:", err);
      alert("Failed to delete service section");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI
  return (
    <div className="w-full min-h-screen bg-blue-950 py-10 flex justify-center items-center">
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="bg-white shadow-lg rounded-xl p-8 relative min-h-[600px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 bg-white rounded-xl z-20">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-blue-700 font-semibold">Processing...</p>
            </div>
          ) : (
            <form
              onSubmit={submitForm}
              className="space-y-6 overflow-y-auto max-h-[80vh] p-2"
            >
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                {isEditMode
                  ? "Edit Services Section"
                  : "Create Services Section"}
              </h1>

              {/* General fields */}
              <div>
                <label className="block text-sm font-semibold mb-1">Top Text</label>
                <input
                  type="text"
                  name="toptext"
                  value={formData.toptext}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter top text"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Heading</label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter main heading"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Paragraph</label>
                <textarea
                  name="paragraph"
                  value={formData.paragraph}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  rows="4"
                  placeholder="Enter main paragraph"
                />
              </div>

              {/* Card sections */}
              {[1, 2, 3].map((num) => (
                <div key={num} className="border rounded-lg p-4">
                  <h2 className="font-bold text-lg mb-3 text-gray-800">
                    Card {num}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex flex-col gap-2 sm:w-1/2">
                      <label className="text-sm font-medium">Upload Image</label>

                      {/* ✅ Fixed upload button */}
                      <label
                        className={`cursor-pointer flex items-center justify-center w-[30%] bg-blue-500 text-white px-4 py-2 rounded-lg transition-all ${
                          uploading[`card${num}img`]
                            ? "opacity-70"
                            : "hover:bg-blue-600"
                        }`}
                      >
                        {uploading[`card${num}img`] ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          "Upload"
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, `card${num}img`)}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="text"
                        name={`card${num}img`}
                        value={formData[`card${num}img`] || ""}
                        onChange={handleInputChange}
                        placeholder="Or paste image URL"
                        className="w-full p-2 border rounded-lg"
                      />
                      {formData[`card${num}img`] && (
                        <img
                          src={formData[`card${num}img`]}
                          alt={`Card ${num} preview`}
                          className="w-24 h-24 object-cover border rounded"
                        />
                      )}
                    </div>
                    <div className="sm:w-1/2 space-y-2">
                      <input
                        type="text"
                        name={`card${num}heading`}
                        value={formData[`card${num}heading`]}
                        onChange={handleInputChange}
                        placeholder={`Card ${num} heading`}
                        className="w-full p-3 border rounded-lg"
                      />
                      <textarea
                        name={`card${num}paragraph`}
                        value={formData[`card${num}paragraph`]}
                        onChange={handleInputChange}
                        placeholder={`Card ${num} paragraph`}
                        rows="3"
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="w-[25%] bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  {isEditMode ? "Update" : "Create"}
                </button>

                {isEditMode && (
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

export default ServicesForm;
