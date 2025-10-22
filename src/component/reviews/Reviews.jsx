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
    const loadreviewsId = async () => {
      try {
        const res = await getreviews();
        const reviewsData = Array.isArray(res) ? res[0] : res;

        if (reviewsData) {
          setReviewsId(reviewsData._id);
          setIsEditMode(true);
        }
      } catch (err) {
        console.error("Failed to fetch reviewsId:", err);
      }
    };

    loadreviewsId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadForEdit = async () => {
    if (!reviewsId) return;

    try {
      const allreviewss = await getreviews();
      const reviews = allreviewss.find((h) => h._id === reviewsId);

      if (reviews) {
        setFormData({
          mainheading: reviews.mainheading || "",

          userimg1: reviews.userimg1 || "",
          username1: reviews.username1 || "",
          usertitle1: reviews.usertitle1 || "",
          cardheading1: reviews.cardheading1 || "",
          carddescription1: reviews.carddescription1 || "",

          userimg2: reviews.userimg2 || "",
          username2: reviews.username2 || "",
          usertitle2: reviews.usertitle2 || "",
          cardheading2: reviews.cardheading2 || "",
          carddescription2: reviews.carddescription2 || "",

          userimg3: reviews.userimg3 || "",
          username3: reviews.username3 || "",
          usertitle3: reviews.usertitle3 || "",
          cardheading3: reviews.cardheading3 || "",
          carddescription3: reviews.carddescription3 || "",

          userimg4: reviews.userimg4 || "",
          username4: reviews.username4 || "",
          usertitle4: reviews.usertitle4 || "",
          cardheading4: reviews.cardheading4 || "",
          carddescription4: reviews.carddescription4 || "",

          userimg5: reviews.userimg5 || "",
          username5: reviews.username5 || "",
          usertitle5: reviews.usertitle5 || "",
          cardheading5: reviews.cardheading5 || "",
          carddescription5: reviews.carddescription5 || "",

          userimg6: reviews.userimg6 || "",
          username6: reviews.username6 || "",
          usertitle6: reviews.usertitle6 || "",
          cardheading6: reviews.cardheading6 || "",
          carddescription6: reviews.carddescription6 || "",

          userimg7: reviews.userimg7 || "",
          username7: reviews.username7 || "",
          usertitle7: reviews.usertitle7 || "",
          cardheading7: reviews.cardheading7 || "",
          carddescription7: reviews.carddescription7 || "",

          userimg8: reviews.userimg8 || "",
          username8: reviews.username8 || "",
          usertitle8: reviews.usertitle8 || "",
          cardheading8: reviews.cardheading8 || "",
          carddescription8: reviews.carddescription8 || "",
        });
      }
    } catch (err) {
      console.error("Failed to load reviews data for edit:", err);
    }
  };

const submitForm = async (e) => {
  e.preventDefault();
  try {
    let res;

    if (IsEditMode && reviewsId) {
      // Update Mode
      res = await updatereviews(reviewsId, formData);
      if (res) {
        alert("reviews section updated successfully!");
        setFormData({ ...emptyForm });
      }
    } else {
      // Create Mode
      res = await createreviews(formData);
      if (res) {
        alert(
          "reviews section created successfully! You can now update or delete it."
        );

        // ✅ Pehle state turant set karo
        const newId = res._id || res.data?._id || null;
        setReviewsId(newId);
        setIsEditMode(true);

        // ✅ Backend se fresh data reload karo (UI instantly update ho)
        const all = await getreviews();
        const latest = Array.isArray(all) ? all[0] : all;
        if (latest?._id) {
          setReviewsId(latest._id);
          setFormData(latest);
        }

        // ✅ Form reset thoda delay se taake re-render complete ho
        setTimeout(() => {
          setFormData({ ...emptyForm });
        }, 300);
      }
    }
  } catch (err) {
    console.error("Error submitting reviews section:", err);
    alert("Something went wrong. Check the console for details.");
  }
};


const handleDelete = async () => {
  if (!reviewsId) return alert("Nothing to delete");
  if (!confirm("Are you sure you want to delete this reviews section?")) return;

  try {
    const res = await deletereviews(reviewsId);

    // ✅ Delete hone ke baad response kuch bhi ho, buttons hide kar do
    alert("reviews section deleted successfully!");

    // ✅ Pehle state reset karo (buttons hide turant)
    setIsEditMode(false);
    setReviewsId(null);

    // ✅ Form clear thoda delay se
    setTimeout(() => {
      setFormData({ ...emptyForm });
    }, 200);
  } catch (err) {
    console.error("Error deleting reviews section:", err);
    alert("Failed to delete reviews section");
  }
};



  return (
    <div className="w-full min-h-screen bg-blue-950 py-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Reviews Form
        </h1>

        <form onSubmit={submitForm} className="space-y-6">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              main heading
            </label>
            <input
              type="text"
              name="mainheading"
              value={formData.mainheading}
              onChange={handleInputChange}
              placeholder="Enter main heading"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Review 1 */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Review #1</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Image 1
              </label>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "userimg1")}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  name="userimg1"
                  value={formData.userimg1}
                  onChange={handleInputChange}
                  placeholder="Image URL will appear here..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {formData.userimg1 && (
                <img
                  src={formData.userimg1}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover border rounded"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Reviewer Name"
              name="username1"
              value={formData.username1}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Reviewer Title"
              name="usertitle1"
              value={formData.usertitle1}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Card Heading"
              name="cardheading1"
              value={formData.cardheading1}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Card Description"
              name="carddescription1"
              value={formData.carddescription1}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* //reviews 2 */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Review #2</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Image 2
              </label>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "userimg2")}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  name="userimg2"
                  value={formData.userimg2}
                  onChange={handleInputChange}
                  placeholder="Image URL will appear here..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {formData.userimg2 && (
                <img
                  src={formData.userimg2}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover border rounded"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Reviewer Name"
              name="username2"
              value={formData.username2}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Reviewer Title"
              name="usertitle2"
              value={formData.usertitle2}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Card Heading"
              name="cardheading2"
              value={formData.cardheading2}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Card Description"
              name="carddescription2"
              value={formData.carddescription2}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Review 3 */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Review #3</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Image 3
              </label>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "userimg3")}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  name="userimg3"
                  value={formData.userimg3}
                  onChange={handleInputChange}
                  placeholder="Image URL will appear here..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {formData.userimg3 && (
                <img
                  src={formData.userimg3}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover border rounded"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Reviewer Name"
              name="username3"
              value={formData.username3}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Reviewer Title"
              name="usertitle3"
              value={formData.usertitle3}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Card Heading"
              name="cardheading3"
              value={formData.cardheading3}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Card Description"
              name="carddescription3"
              value={formData.carddescription3}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Review 4 */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Review #4</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Image 4
              </label>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "userimg4")}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  name="userimg4"
                  value={formData.userimg4}
                  onChange={handleInputChange}
                  placeholder="Image URL will appear here..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {formData.userimg4 && (
                <img
                  src={formData.userimg4}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover border rounded"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Reviewer Name"
              name="username4"
              value={formData.username4}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Reviewer Title"
              name="usertitle4"
              value={formData.usertitle4}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Card Heading"
              name="cardheading4"
              value={formData.cardheading4}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Card Description"
              name="carddescription4"
              value={formData.carddescription4}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Review 5 */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Review #5</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Image 5
              </label>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "userimg5")}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  name="userimg5"
                  value={formData.userimg5}
                  onChange={handleInputChange}
                  placeholder="Image URL will appear here..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {formData.userimg5 && (
                <img
                  src={formData.userimg5}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover border rounded"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Reviewer Name"
              name="username5"
              value={formData.username5}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Reviewer Title"
              name="usertitle5"
              value={formData.usertitle5}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Card Heading"
              name="cardheading5"
              value={formData.cardheading5}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Card Description"
              name="carddescription5"
              value={formData.carddescription5}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Review 6 */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Review #6</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Image 6
              </label>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "userimg6")}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  name="userimg6"
                  value={formData.userimg6}
                  onChange={handleInputChange}
                  placeholder="Image URL will appear here..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {formData.userimg6 && (
                <img
                  src={formData.userimg6}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover border rounded"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Reviewer Name"
              name="username6"
              value={formData.username6}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Reviewer Title"
              name="usertitle6"
              value={formData.usertitle6}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Card Heading"
              name="cardheading6"
              value={formData.cardheading6}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Card Description"
              name="carddescription6"
              value={formData.carddescription6}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Review 7 */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Review #7</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Image 7
              </label>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "userimg7")}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  name="userimg7"
                  value={formData.userimg7}
                  onChange={handleInputChange}
                  placeholder="Image URL will appear here..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {formData.userimg7 && (
                <img
                  src={formData.userimg7}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover border rounded"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Reviewer Name"
              name="username7"
              value={formData.username7}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Reviewer Title"
              name="usertitle7"
              value={formData.usertitle7}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Card Heading"
              name="cardheading7"
              value={formData.cardheading7}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Card Description"
              name="carddescription7"
              value={formData.carddescription7}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Review 8 */}
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Review #8</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Image 8
              </label>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "userimg8")}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  name="userimg8"
                  value={formData.userimg8}
                  onChange={handleInputChange}
                  placeholder="Image URL will appear here..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {formData.userimg8 && (
                <img
                  src={formData.userimg8}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover border rounded"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Reviewer Name"
              name="username8"
              value={formData.username8}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Reviewer Title"
              name="usertitle8"
              value={formData.usertitle8}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Card Heading"
              name="cardheading8"
              value={formData.cardheading8}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Card Description"
              name="carddescription8"
              value={formData.carddescription8}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-2 rounded"
            >
              {reviewsId ? "Update reviews" : "Save reviews Section"}
            </button>
            {reviewsId && (
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
                  Delete reviews
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewsFormStatic;
