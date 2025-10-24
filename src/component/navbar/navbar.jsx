"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const NavbarForm = () => {
  const { getNavbar, createNavbar, updateNavbar, deleteNavbar } = useContext(Appcontext);

  const emptyForm = {
    logo_white: "",
    logo_black: "",
    navlinks: [{ link: "" }],
  };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [isEditMode, setIsEditMode] = useState(false);
  const [navbarId, setNavbarId] = useState(null);
  const [uploading, setUploading] = useState({ white: false, black: false });
  const [loading, setLoading] = useState(false);

  const [previewWhite, setPreviewWhite] = useState("");
  const [previewBlack, setPreviewBlack] = useState("");

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const CLOUD_NAME = "dhtpqla2b";
    const UPLOAD_PRESET = "unsigned_preset";
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploading((prev) => ({ ...prev, [field === "logo_white" ? "white" : "black"]: true }));

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();

      setFormData((prev) => ({ ...prev, [field]: data.secure_url }));

      if (field === "logo_white") setPreviewWhite(data.secure_url);
      else setPreviewBlack(data.secure_url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading((prev) => ({ ...prev, [field === "logo_white" ? "white" : "black"]: false }));
      e.target.value = ""; 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getNavbar();
        if (res) {
          setNavbarId(res._id);
          setIsEditMode(true);
          setFormData({
            logo_white: res.logo_white || "",
            logo_black: res.logo_black || "",
            navlinks: Array.isArray(res.navlinks) && res.navlinks.length > 0 ? res.navlinks : [{ link: "" }],
          });

          setPreviewWhite(res.logo_white || "");
          setPreviewBlack(res.logo_black || "");
        }
      } catch (err) {
        console.error("Failed to load navbar:", err);
      }
    };
    loadData();
  }, []);

  const handleNavlinkChange = (index, value) => {
    const newNavlinks = [...formData.navlinks];
    newNavlinks[index] = { link: value };
    setFormData({ ...formData, navlinks: newNavlinks });
  };

  const addNavlink = () => {
    setFormData({ ...formData, navlinks: [...formData.navlinks, { link: "" }] });
  };

  const removeNavlink = (index) => {
    const newNavlinks = formData.navlinks.filter((_, i) => i !== index);
    setFormData({ ...formData, navlinks: newNavlinks.length ? newNavlinks : [{ link: "" }] });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode && navbarId) {
        await updateNavbar(navbarId, formData);
      } else {
        const res = await createNavbar(formData);
        if (res?._id) {
          setNavbarId(res._id);
          setIsEditMode(true);
        }
      }

      setFormData((prev) => ({
        ...prev,
        logo_white: "",
        logo_black: "",
      }));
    } catch (err) {
      console.error("Error submitting Navbar:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!navbarId) return alert("No Navbar found to delete!");
    if (!confirm("Are you sure you want to delete this Navbar section?")) return;

    setLoading(true);
    try {
      await deleteNavbar(navbarId);
      alert("Navbar deleted successfully!");
      setFormData({ ...emptyForm });
      setNavbarId(null);
      setIsEditMode(false);
      setPreviewWhite("");
      setPreviewBlack("");
    } catch (err) {
      console.error("Error deleting Navbar:", err);
      alert("Failed to delete Navbar!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 py-8 overflow-y-auto flex items-center justify-center">
      <div className="max-w-full mx-auto px-6 h-screen w-full">
        <div className="w-full bg-white shadow-md rounded-lg p-6 relative min-h-[500px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-blue-700 font-semibold">Processing...</p>
            </div>
          ) : (
            <form onSubmit={submitForm} className="w-full space-y-5">
              <h1 className="text-3xl font-bold text-center text-gray-900">
                {isEditMode ? "Edit Navbar" : "Create Navbar"}
              </h1>

              <div>
                <label className="block font-medium mb-2">Logo (Light)</label>
                <div className="flex items-center gap-2">
                  <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                    {uploading.white ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "logo_white")}
                    />
                  </label>
                  <input
                    type="text"
                    name="logo_white"
                    value={formData.logo_white}
                    onChange={handleInputChange}
                    placeholder="Or paste image URL"
                    className="flex-1 border rounded p-2"
                  />
                </div>
                {previewWhite && (
                  <img
                    src={previewWhite}
                    alt="Logo White Preview"
                    className="w-24 h-24 mt-2 object-cover border rounded"
                  />
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Logo (Dark)</label>
                <div className="flex items-center gap-2">
                  <label className="bg-gray-800 text-white px-4 py-2 rounded cursor-pointer">
                    {uploading.black ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "logo_black")}
                    />
                  </label>
                  <input
                    type="text"
                    name="logo_black"
                    value={formData.logo_black}
                    onChange={handleInputChange}
                    placeholder="Or paste image URL"
                    className="flex-1 border rounded p-2"
                  />
                </div>
                {previewBlack && (
                  <img
                    src={previewBlack}
                    alt="Logo Black Preview"
                    className="w-24 h-24 mt-2 object-cover border rounded"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Navigation Links</label>
                <button
                  type="button"
                  onClick={addNavlink}
                  className="bg-blue-500 text-white px-4 mb-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
                >
                  + Add Link
                </button>

                <div className="grid grid-cols-2 gap-4">
                  {formData.navlinks.map((nav, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nav.link}
                        onChange={(e) => handleNavlinkChange(index, e.target.value)}
                        placeholder={`Link ${index + 1}`}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeNavlink(index)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="w-[20%] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  {isEditMode ? "Update Navbar" : "Create Navbar"}
                </button>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-[20%] bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Delete Navbar
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

export default NavbarForm;
