import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const Joinus = () => {
  const { getJoinus, createJoinus, updateJoinus, deleteJoinus } =
    useContext(Appcontext);

  const emptyForm = {
    img: "",
    toptext: "",
    heading: "",
    paragraph: "",
    buttontext: "",
    text1: "",
    text2: "",
  };

  const [joinusId, setJoinusId] = useState(null);
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
    const loadJoinusId = async () => {
      try {
        const res = await getJoinus();
        const JoinusData = Array.isArray(res) ? res[0] : res;

        if (JoinusData) {
          setJoinusId(JoinusData._id);
          setIsEditMode(true);
        }
      } catch (err) {
        console.error("Failed to fetch JoinusId:", err);
      }
    };

    loadJoinusId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadForEdit = async () => {
    if (!joinusId) return;

    try {
      const allJoinus = await getJoinus();
      const joinus = allJoinus.find((j) => j._id === joinusId);

      if (joinus) {
        setFormData({
          img: joinus.img || "",
          toptext: joinus.toptext || "",
          heading: joinus.heading || "",
          paragraph: joinus.paragraph || "",
          buttontext: joinus.buttontext || "",
          text1: joinus.text1 || "",
          text2: joinus.text2 || "",
        });
      }
    } catch (err) {
      console.error("Failed to load Joinus data for edit:", err);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let res;

      if (IsEditMode && joinusId) {
        res = await updateJoinus(joinusId, formData);
        if (res) {
          alert("Joinus section updated successfully!");

          setFormData({ ...emptyForm });
        }
      } else {
        res = await createJoinus(formData);
        if (res) {
          alert(
            "Joinus section created successfully! You can now update or delete it."
          );

          setFormData({ ...emptyForm });
          setJoinusId(res._id);
          setIsEditMode(true);
        }
      }
    } catch (err) {
      console.error("Error submitting Joinus section:", err);
      alert("Something went wrong. Check the console for details.");
    }
  };

  const handleDelete = async () => {
    if (!joinusId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this Joinus section?"))
      return;

    try {
      const res = await deleteJoinus(joinusId);
      if (res?._id) {
        setFormData({ ...emptyForm });
        setJoinusId(null);
        setIsEditMode(false);
        alert("Joinus section deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting Joinus section:", err);
      alert("Failed to delete Joinus section");
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 overflow-auto py-10">
      <div className="w-full max-w-full mx-auto p-6">
        <form
          onSubmit={submitForm}
          className="bg-white shadow-md rounded-lg p-8 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-gray-900">
            {IsEditMode ? "Edit Joinus" : "Create Joinus"}
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
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              placeholder="Enter main heading"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              placeholder="Enter paragraph"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
              Check Point
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttontext"
                  value={formData.buttontext}
                  onChange={handleInputChange}
                  placeholder="Enter button text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number Text
                </label>
                <input
                  type="text"
                  name="text1"
                  value={formData.text1}
                  onChange={handleInputChange}
                  placeholder="Enter number description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number
                </label>
                <input
                  type="number"
                  name="text2"
                  value={formData.text2}
                  onChange={handleInputChange}
                  placeholder="Enter number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

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
                  onChange={(e) => handleFileUpload(e, "img")}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                name="img"
                value={formData.img || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/main-image.jpg"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {formData.img && (
              <img
                src={formData.img}
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
              {IsEditMode ? "Update Joinus" : "Create Joinus"}
            </button>

            {joinusId && (
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

export default Joinus;
