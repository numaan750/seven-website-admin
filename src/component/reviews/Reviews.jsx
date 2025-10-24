"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const ReviewsFormStatic = () => {
  const { getreviews, createreviews, updatereviews, deletereviews } =
    useContext(Appcontext);

  const emptyForm = {
    mainheading: "",

    userimg1: "",
    username1: "",
    usertitle1: "",
    cardheading1: "",
    carddescription1: "",

    userimg2: "",
    username2: "",
    usertitle2: "",
    cardheading2: "",
    carddescription2: "",

    userimg3: "",
    username3: "",
    usertitle3: "",
    cardheading3: "",
    carddescription3: "",

    userimg4: "",
    username4: "",
    usertitle4: "",
    cardheading4: "",
    carddescription4: "",

    userimg5: "",
    username5: "",
    usertitle5: "",
    cardheading5: "",
    carddescription5: "",

    userimg6: "",
    username6: "",
    usertitle6: "",
    cardheading6: "",
    carddescription6: "",

    userimg7: "",
    username7: "",
    usertitle7: "",
    cardheading7: "",
    carddescription7: "",

    userimg8: "",
    username8: "",
    usertitle8: "",
    cardheading8: "",
    carddescription8: "",
  };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [IsEditMode, setIsEditMode] = useState(false);
  const [reviewsId, setReviewsId] = useState(null);
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

  const loadReviewsData = async () => {
    try {
      setLoading(true);
      const res = await getreviews();
      const reviewsData = Array.isArray(res) ? res[0] : res;

      if (reviewsData) {
        setReviewsId(reviewsData._id);
        setIsEditMode(true);
        setFormData({
          ...emptyForm,
          ...reviewsData,
        });
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviewsData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (IsEditMode && reviewsId) {
        await updatereviews(reviewsId, formData);
      } else {
        const res = await createreviews(formData);
        if (res?._id) {
          setReviewsId(res._id);
          setIsEditMode(true);
        }
      }
      await loadReviewsData();
    } catch (err) {
      console.error("Error submitting reviews section:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reviewsId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this reviews section?"))
      return;

    setLoading(true);
    try {
      await deletereviews(reviewsId);
      setFormData({ ...emptyForm });
      setReviewsId(null);
      setIsEditMode(false);
      alert("Reviews section deleted successfully!");
    } catch (err) {
      console.error("Error deleting reviews section:", err);
      alert("Failed to delete reviews section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 py-10 flex justify-center items-center">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="bg-white shadow-lg rounded-xl p-8 relative min-h-[500px] flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 bg-white/80 backdrop-blur-sm z-10">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-blue-700 font-semibold">Processing...</p>
            </div>
          )}

          <form
            onSubmit={submitForm}
            className="w-full space-y-6 overflow-y-auto max-h-[85vh] p-2"
          >
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
              {IsEditMode ? "Edit Reviews Section" : "Create Reviews Section"}
            </h1>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
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

            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Review #1</h3>
              <UploadField
                idx={1}
                formData={formData}
                handleFileUpload={handleFileUpload}
                handleInputChange={handleInputChange}
              />
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Review #2</h3>
              <UploadField
                idx={2}
                formData={formData}
                handleFileUpload={handleFileUpload}
                handleInputChange={handleInputChange}
              />
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Review #3</h3>
              <UploadField
                idx={3}
                formData={formData}
                handleFileUpload={handleFileUpload}
                handleInputChange={handleInputChange}
              />
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Review #4</h3>
              <UploadField
                idx={4}
                formData={formData}
                handleFileUpload={handleFileUpload}
                handleInputChange={handleInputChange}
              />
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Review #5</h3>
              <UploadField
                idx={5}
                formData={formData}
                handleFileUpload={handleFileUpload}
                handleInputChange={handleInputChange}
              />
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Review #6</h3>
              <UploadField
                idx={6}
                formData={formData}
                handleFileUpload={handleFileUpload}
                handleInputChange={handleInputChange}
              />
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Review #7</h3>
              <UploadField
                idx={7}
                formData={formData}
                handleFileUpload={handleFileUpload}
                handleInputChange={handleInputChange}
              />
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Review #8</h3>
              <UploadField
                idx={8}
                formData={formData}
                handleFileUpload={handleFileUpload}
                handleInputChange={handleInputChange}
              />
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
        </div>
      </div>
    </div>
  );
};

const UploadField = ({
  idx,
  formData,
  handleFileUpload,
  handleInputChange,
}) => (
  <>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        User Image {idx}
      </label>
      <div className="flex items-center gap-2">
        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Upload
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, `userimg${idx}`)}
            className="hidden"
          />
        </label>
        <input
          type="text"
          name={`userimg${idx}`}
          value={formData[`userimg${idx}`]}
          onChange={handleInputChange}
          placeholder="Image URL"
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
      </div>
      {formData[`userimg${idx}`] && (
        <img
          src={formData[`userimg${idx}`]}
          alt="Preview"
          className="w-24 h-24 mt-2 object-cover border rounded"
        />
      )}
    </div>

    <input
      type="text"
      placeholder="Reviewer Name"
      name={`username${idx}`}
      value={formData[`username${idx}`]}
      onChange={handleInputChange}
      className="w-full p-2 border rounded mb-2"
    />
    <input
      type="text"
      placeholder="Reviewer Title"
      name={`usertitle${idx}`}
      value={formData[`usertitle${idx}`]}
      onChange={handleInputChange}
      className="w-full p-2 border rounded mb-2"
    />
    <input
      type="text"
      placeholder="Card Heading"
      name={`cardheading${idx}`}
      value={formData[`cardheading${idx}`]}
      onChange={handleInputChange}
      className="w-full p-2 border rounded mb-2"
    />
    <textarea
      placeholder="Card Description"
      name={`carddescription${idx}`}
      value={formData[`carddescription${idx}`]}
      onChange={handleInputChange}
      className="w-full p-2 border rounded"
    />
  </>
);

export default ReviewsFormStatic;
