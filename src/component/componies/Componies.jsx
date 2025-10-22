import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const Componies = () => {
  const { getcomponies, createcomponies, updatecomponies, deletecomponies } =
    useContext(Appcontext);

  const emptyForm = {
    heading: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    img5: "",
    img6: "",
  };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [componiesId, setcomponiesId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const loadComponiesData = async () => {
      try {
        const res = await getcomponies();
        const componiesData = Array.isArray(res) ? res[0] : res;

        if (componiesData) {
          setcomponiesId(componiesData._id);
          setIsEditMode(true);
        }
      } catch (err) {
        console.error("Failed to fetch componies:", err);
      }
    };

    loadComponiesData();
  }, []);

  const loadForEdit = async () => {
    if (!componiesId) return;
    try {
      const allcomponies = await getcomponies();
      const componies = allcomponies.find((c) => c._id === componiesId);
      if (componies) {
        setFormData({
          heading: componies.heading || "",
          img1: componies.img1 || "",
          img2: componies.img2 || "",
          img3: componies.img3 || "",
          img4: componies.img4 || "",
          img5: componies.img5 || "",
          img6: componies.img6 || "",
        });
      }
    } catch (err) {
      console.error("Failed to load componies data for edit:", err);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isEditMode && componiesId) {
        res = await updatecomponies(componiesId, formData);
        if (res) {
          alert("Companies section updated successfully!");
          setFormData({ ...emptyForm });
        }
      } else {
        res = await createcomponies(formData);
        if (res) {
          alert("Companies section created successfully!");
          setFormData({ ...emptyForm });
          setcomponiesId(res._id);
          setIsEditMode(true);
        }
      }
    } catch (err) {
      console.error("Error submitting componies:", err);
      alert("Something went wrong. Check the console.");
    }
  };

  const handleDelete = async () => {
    if (!componiesId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      const res = await deletecomponies(componiesId);
      if (res?._id) {
        setFormData({ ...emptyForm });
        setcomponiesId(null);
        setIsEditMode(false);
        alert("Companies section deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting componies:", err);
      alert("Failed to delete companies section");
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 overflow-auto py-10">
      <div className="w-full max-w-full mx-auto px-6">
        <form
          onSubmit={submitForm}
          className="w-full bg-white shadow-lg rounded-xl p-8 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
            {isEditMode ? "Edit Companies" : "Create Companies"}
          </h1>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Main Heading
            </label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              placeholder="Enter main heading"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image 1
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "img1")}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                name="img1"
                value={formData.img1}
                onChange={handleInputChange}
                placeholder="Image URL will appear here..."
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            {formData.img1 && (
              <img
                src={formData.img1}
                alt="Preview 1"
                className="w-24 h-24 mt-2 object-cover border rounded"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image 2
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "img2")}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                name="img2"
                value={formData.img2}
                onChange={handleInputChange}
                placeholder="Image URL will appear here..."
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            {formData.img2 && (
              <img
                src={formData.img2}
                alt="Preview 2"
                className="w-24 h-24 mt-2 object-cover border rounded"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image 3
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "img3")}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                name="img3"
                value={formData.img3}
                onChange={handleInputChange}
                placeholder="Image URL will appear here..."
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            {formData.img3 && (
              <img
                src={formData.img3}
                alt="Preview 3"
                className="w-24 h-24 mt-2 object-cover border rounded"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image 4
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "img4")}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                name="img4"
                value={formData.img4}
                onChange={handleInputChange}
                placeholder="Image URL will appear here..."
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            {formData.img4 && (
              <img
                src={formData.img4}
                alt="Preview 4"
                className="w-24 h-24 mt-2 object-cover border rounded"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image 5
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "img5")}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                name="img5"
                value={formData.img5}
                onChange={handleInputChange}
                placeholder="Image URL will appear here..."
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            {formData.img5 && (
              <img
                src={formData.img5}
                alt="Preview 5"
                className="w-24 h-24 mt-2 object-cover border rounded"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image 6
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "img6")}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                name="img6"
                value={formData.img6}
                onChange={handleInputChange}
                placeholder="Image URL will appear here..."
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            {formData.img6 && (
              <img
                src={formData.img6}
                alt="Preview 6"
                className="w-24 h-24 mt-2 object-cover border rounded"
              />
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {isEditMode ? "Update" : "Create"}
            </button>

            {isEditMode && (
              <>
                <button
                  type="button"
                  onClick={loadForEdit}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Load for Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
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

export default Componies;
