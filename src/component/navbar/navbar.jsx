"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const NavbarForm = () => {
  const { getNavbar, createNavbar, updateNavbar, deleteNavbar } =
    useContext(Appcontext);

  const emptyForm = { logo: "", navlinks: [{ link: "" }] };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [isEditMode, setIsEditMode] = useState(false);
  const [navbarId, setNavbarId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
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
        { method: "POST", body: uploadForm }
      );
      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          logo: data.secure_url,
        }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed");
    } finally {
      setLoading(false);
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
    setFormData({
      ...formData,
      navlinks: [...formData.navlinks, { link: "" }],
    });
  };

  const removeNavlink = (index) => {
    const newNavlinks = formData.navlinks.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      navlinks: newNavlinks.length ? newNavlinks : [{ link: "" }],
    });
  };

  const loadForEdit = async () => {
    if (!navbarId) return;
    try {
      const res = await getNavbar();
      if (res?._id === navbarId) {
        setFormData({
          logo: res.logo || "",
          navlinks:
            Array.isArray(res.navlinks) && res.navlinks.length > 0
              ? res.navlinks
              : [{ link: "" }],
        });
      }
    } catch (err) {
      console.error("Failed to load navbar for edit:", err);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isEditMode && navbarId) {
        res = await updateNavbar(navbarId, formData);
        if (res) {
          alert(" Navbar updated successfully!");
          setFormData({ ...emptyForm });
        }
      } else {
        res = await createNavbar(formData);
        if (res) {
          setNavbarId(res._id);
          setIsEditMode(true);
          alert(" Navbar created successfully!");
          setFormData({ ...emptyForm });
        }
      }
    } catch (err) {
      console.error("Error submitting Navbar:", err);
      alert("Something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (!navbarId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete this Navbar?")) return;

    try {
      const res = await deleteNavbar(navbarId);
      if (res?._id) {
        setFormData({ ...emptyForm });
        setNavbarId(null);
        setIsEditMode(false);
        alert("🗑️ Navbar deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting Navbar:", err);
      alert("Failed to delete navbar");
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 py-8 overflow-y-auto">
      <div className="max-w-full mx-auto px-6">
        <form
          onSubmit={submitForm}
          className="w-full bg-white shadow-md rounded-lg p-6 space-y-5"
        >
          <h1 className="text-3xl font-bold text-center text-gray-900">
            {isEditMode ? "Edit Navbar" : "Create Navbar"}
          </h1>

          <div>
            <label className="block font-medium mb-2">Logo</label>
            <div className="flex items-center gap-2">
              <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                {loading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                placeholder="Or paste image URL"
                className="flex-1 border rounded p-2"
              />
            </div>
            {formData.logo && (
              <img
                src={formData.logo}
                alt="Logo"
                className="w-24 h-24 mt-2 object-cover border rounded"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Navigation Links
            </label>
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
              <>
                <button
                  type="button"
                  onClick={loadForEdit}
                  className="w-[20%] bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Load for Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-[20%] bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Delete Navbar
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NavbarForm;
