"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const Worksection = () => {
  const {
    getWorkwithus,
    createWorkwithus,
    updateWorkwithus,
    deleteWorkwithus,
  } = useContext(Appcontext);

  const emptyForm = {
    toptext: "",
    heading: "",
    paragraph: "",
    check1: "",
    check2: "",
    check3: "",
    check4: "",
    check5: "",
    check6: "",
    mainimg: "",
  };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [IsEditMode, setIsEditMode] = useState(false);
  const [WorkwithusId, setWorkwithusId] = useState(null);
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

  const loadWorkwithusData = async () => {
    try {
      setLoading(true);
      const res = await getWorkwithus();
      const WorkwithusData = Array.isArray(res) ? res[0] : res;

      if (WorkwithusData) {
        setWorkwithusId(WorkwithusData._id);
        setIsEditMode(true);
        setFormData({
          toptext: WorkwithusData.toptext || "",
          heading: WorkwithusData.heading || "",
          paragraph: WorkwithusData.paragraph || "",
          check1: WorkwithusData.check1 || "",
          check2: WorkwithusData.check2 || "",
          check3: WorkwithusData.check3 || "",
          check4: WorkwithusData.check4 || "",
          check5: WorkwithusData.check5 || "",
          check6: WorkwithusData.check6 || "",
          mainimg: WorkwithusData.mainimg || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch Workwithus:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkwithusData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (IsEditMode && WorkwithusId) {
        await updateWorkwithus(WorkwithusId, formData);
      } else {
        const res = await createWorkwithus(formData);
        if (res?._id) {
          setWorkwithusId(res._id);
          setIsEditMode(true);
        }
      }
      await loadWorkwithusData();
    } catch (err) {
      console.error("Error submitting Work section:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!WorkwithusId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this Workwithus section?"))
      return;

    setLoading(true);
    try {
      await deleteWorkwithus(WorkwithusId);
      setFormData({ ...emptyForm });
      setWorkwithusId(null);
      setIsEditMode(false);
      alert("Work section deleted successfully!");
    } catch (err) {
      console.error("Error deleting Work section:", err);
      alert("Failed to delete Work section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 py-10 flex justify-center items-center">
      <div className="w-full max-w-full mx-auto px-6">
        <div className="bg-white shadow-lg rounded-xl p-8 relative min-h-[500px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-full bg-white absolute inset-0 rounded-xl z-20">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-blue-700 font-semibold">Processing...</p>
            </div>
          ) : (
            <form
              onSubmit={submitForm}
              className="w-full space-y-6 overflow-y-auto max-h-[85vh] p-2"
            >
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                {IsEditMode
                  ? "Edit Work With Us Section"
                  : "Create Work With Us Section"}
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
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  placeholder="Enter main heading"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">
                Check Points
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check Point {num}
                    </label>
                    <input
                      type="text"
                      name={`check${num}`}
                      value={formData[`check${num}`]}
                      onChange={handleInputChange}
                      placeholder={`Enter checkpoint ${num} text`}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Upload
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
                    placeholder="Image URL"
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

export default Worksection;
