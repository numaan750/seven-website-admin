"use client";
import { Appcontext } from "@/context/Appcontext";
import React, { useContext, useEffect, useState } from "react";

const Footer = () => {
  const { getFooter, createFooter, updateFooter, deleteFooter } =
    useContext(Appcontext);

  const emptyForm = {
    section1: {
      logo: "",
      text1: "",
      text2: "",
      buttontext: "",
    },
    section2: { title: "COMPANY", items: [{ text: "" }] },
    section3: { title: "INFO", items: [{ text: "" }] },
    section4: { title: "CONNECT", items: [{ text: "" }] },
    copywrittext: "",
  };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [footerId, setFooterId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      setUploading(true); 

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: uploadForm }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        section1: {
          ...prev.section1,
          logo: data.secure_url,
        },
      }));

    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e, section, index = null) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev };
      if (section && index !== null) {
        updated[section].items[index].text = value;
      } else if (section) {
        updated[section][name] = value;
      } else {
        updated[name] = value;
      }
      return updated;
    });
  };

  const handleAddLink = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        items: [...prev[section].items, { text: "" }],
      },
    }));
  };

  const handleRemoveLink = (section, index) => {
    setFormData((prev) => {
      const updatedItems = prev[section].items.filter((_, i) => i !== index);
      return { ...prev, [section]: { ...prev[section], items: updatedItems } };
    });
  };

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await getFooter();
        const footer = Array.isArray(res) ? res[0] : res;
        if (footer) {
          setFooterId(footer._id);
          setIsEditMode(true);
        }
      } catch (err) {
        console.error("Failed to fetch footer:", err);
      }
    };
    fetchFooter();
  }, []);

  const loadForEdit = async () => {
    try {
      const res = await getFooter();
      const footer = Array.isArray(res) ? res[0] : res;

      if (footer) {
        setFooterId(footer._id);

        setFormData({
          section1: {
            logo: footer.section1?.logo || "",
            text1: footer.section1?.text1 || "",
            text2: footer.section1?.text2 || "",
            buttontext: footer.section1?.buttontext || "",
          },
          section2: {
            title: footer.section2?.title || "COMPANY",
            items:
              footer.section2?.items?.length > 0
                ? footer.section2.items.map((i) => ({
                    text: i.text || "",
                  }))
                : [{ text: "" }],
          },
          section3: {
            title: footer.section3?.title || "INFO",
            items:
              footer.section3?.items?.length > 0
                ? footer.section3.items.map((i) => ({
                    text: i.text || "",
                  }))
                : [{ text: "" }],
          },
          section4: {
            title: footer.section4?.title || "CONNECT",
            items:
              footer.section4?.items?.length > 0
                ? footer.section4.items.map((i) => ({
                    text: i.text || "",
                  }))
                : [{ text: "" }],
          },
          copywrittext: footer.copywrittext || "",
        });

        setIsEditMode(true);
        console.log(" Footer data loaded successfully!");
      }
    } catch (error) {
      console.error(" Error loading footer:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditMode && footerId) {
        await updateFooter(footerId, formData);
        alert(" Footer updated successfully!");
      } else {
        const res = await createFooter(formData);
        setFooterId(res._id);
        setIsEditMode(true);
        alert(" Footer created successfully!");
      }
      setFormData({ ...emptyForm });
    } catch (err) {
      console.error("Submit error:", err);
      alert(" Failed to save footer");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!footerId) return alert("Nothing to delete");
    if (!confirm("Are you sure you want to delete the footer?")) return;
    try {
      await deleteFooter(footerId);
      alert("🗑️ Footer deleted successfully!");
      setFormData({ ...emptyForm });
      setFooterId(null);
      setIsEditMode(false);
    } catch (err) {
      console.error("Delete error:", err);
      alert(" Failed to delete footer");
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-950 overflow-auto py-10">
      <div className="w-full max-w-full mx-auto px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white shadow-lg rounded-xl p-8 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            {isEditMode ? "Edit Footer" : "Create Footer"}
          </h1>
          <div>
            <label className="block font-medium mb-2">Footer Logo</label>
            <div className="flex items-center gap-2">
              <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                {uploading ? "Uploading..." : "Upload"}
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
                value={formData.section1.logo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    section1: { ...prev.section1, logo: e.target.value },
                  }))
                }
                placeholder="Or paste image URL"
                className="flex-1 border rounded p-2"
              />
            </div>

            {formData.section1.logo && (
              <img
                src={formData.section1.logo}
                alt="Footer Logo"
                className="w-24 h-24 mt-2 object-cover border rounded"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="text1"
              value={formData.section1.text1}
              onChange={(e) => handleInputChange(e, "section1")}
              placeholder="Text 1"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="text2"
              value={formData.section1.text2}
              onChange={(e) => handleInputChange(e, "section1")}
              placeholder="Text 2"
              className="border p-2 rounded"
            />
          </div>
          <input
            type="text"
            name="buttontext"
            value={formData.section1.buttontext}
            onChange={(e) => handleInputChange(e, "section1")}
            placeholder="Button Text"
            className="w-full border p-2 rounded"
          />

          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b mb-2">
              {formData.section2.title}
            </h2>
            {formData.section2.items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleInputChange(e, "section2", i)}
                  placeholder="Enter company link"
                  className="flex-1 border p-2 rounded"
                />
                {formData.section2.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLink("section2", i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddLink("section2")}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              + Add Company Link
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b mb-2">
              {formData.section3.title}
            </h2>
            {formData.section3.items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleInputChange(e, "section3", i)}
                  placeholder="Enter info link"
                  className="flex-1 border p-2 rounded"
                />
                {formData.section3.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLink("section3", i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddLink("section3")}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              + Add Info Link
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b mb-2">
              {formData.section4.title}
            </h2>
            {formData.section4.items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleInputChange(e, "section4", i)}
                  placeholder="Enter social link"
                  className="flex-1 border p-2 rounded"
                />
                {formData.section4.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLink("section4", i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddLink("section4")}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              + Add Connect Link
            </button>
          </div>

          <div>
            <label className="block font-medium mb-2">Copyright Text</label>
            <input
              type="text"
              name="copywrittext"
              value={formData.copywrittext}
              onChange={handleInputChange}
              placeholder="© 2025 The Seven | All Rights Reserved"
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Footer"
                : "Create Footer"}
            </button>

            {isEditMode && (
              <>
                <button
                  type="button"
                  onClick={loadForEdit}
                  className="bg-yellow-500 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-600"
                >
                  Load for Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700"
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

export default Footer;
