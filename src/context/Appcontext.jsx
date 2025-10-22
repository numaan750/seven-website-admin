"use client";
import React, { createContext, useEffect, useState } from "react";

export const Appcontext = createContext({});

const AppProvider = ({ children }) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE;

  console.log(backendUrl);

  const [token, setToken] = useState(null);


  //ya login k liya hy 
useEffect(() => {
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(storedUser);
    }
  }
}, []);

  const isBrowser = typeof window !== "undefined";
  const [user, setUser] = useState(
    isBrowser ? localStorage.getItem("user") : null
  );
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };
  // lohin api 
  const login = async (email, password) => {
    try {
      const res = await fetch(`${backendUrl}/adminmodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("API response:", data);

      if (data.status === "success") {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user || {}));
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Navbar API handlers
  const getNavbar = async () => {
    try {
      const response = await fetch(`${backendUrl}/navbarmodels`);
      if (!response.ok) throw new Error("API error " + response.status);
      return await response.json();
    } catch (error) {
      console.error("getNavbar Error:", error);
      return null;
    }
  };

  const createNavbar = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/navbarmodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("createNavbar:", result);
      return result;
    } catch (error) {
      console.error("createNavbar Error:", error);
      return null;
    }
  };

  const updateNavbar = async (id, data) => {
    const response = await fetch(`${backendUrl}/navbarmodels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // make sure data has { logo, navlinks }
    });
    return await response.json();
  };

  const deleteNavbar = async (id) => {
    if (!id) throw new Error("No ID provided to deleteNavbar");
    try {
      const response = await fetch(`${backendUrl}/navbarmodels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("deleteNavbar Error:", error);
      return null;
    }
  };

  //HOME KI API
  const getHome = async () => {
    try {
      const response = await fetch(`${backendUrl}/homemodels`);
      if (!response.ok) throw new Error("API error " + response.status);
      return await response.json();
    } catch (error) {
      console.error("gethome Error:", error);
      return null;
    }
  };

  const createHome = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/homemodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("createHome:", result);
      return result;
    } catch (error) {
      console.error("createHome Error:", error);
      return null;
    }
  };

  const updateHome = async (id, data) => {
    const response = await fetch(`${backendUrl}/homemodels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  const deleteHome = async (id) => {
    if (!id) throw new Error("No ID provided to deletehome");
    try {
      const response = await fetch(`${backendUrl}/homemodels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("deleteHome Error:", error);
      return null;
    }
  };

  //About us api
  const getAboutus = async () => {
    try {
      const response = await fetch(`${backendUrl}/aboutmodels`);
      if (!response.ok) throw new Error("API error " + response.status);
      return await response.json();
    } catch (error) {
      console.error("getAboutus Error:", error);
      return null;
    }
  };

  const createAboutus = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/aboutmodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("createAboutus:", result);
      return result;
    } catch (error) {
      console.error("createAboutus Error:", error);
      return null;
    }
  };

  const updateAboutus = async (id, data) => {
    const response = await fetch(`${backendUrl}/aboutmodels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  const deleteAboutus = async (id) => {
    if (!id) throw new Error("No ID provided to deleteAbout");
    try {
      const response = await fetch(`${backendUrl}/aboutmodels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("deleteAboutus Error:", error);
      return null;
    }
  };

  //componies api
  const getcomponies = async () => {
    try {
      const response = await fetch(`${backendUrl}/componeiesmodels`);
      if (!response.ok) throw new Error("API error " + response.status);
      return await response.json();
    } catch (error) {
      console.error("getcomponies Error:", error);
      return null;
    }
  };

  const createcomponies = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/componeiesmodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("createcomponies:", result);
      return result;
    } catch (error) {
      console.error("createcomponies Error:", error);
      return null;
    }
  };

  const updatecomponies = async (id, data) => {
    const response = await fetch(`${backendUrl}/componeiesmodels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  const deletecomponies = async (id) => {
    if (!id) throw new Error("No ID provided to deletecomponies");
    try {
      const response = await fetch(`${backendUrl}/componeiesmodels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("deletecomponies Error:", error);
      return null;
    }
  };

  //servies  api
  const getServies = async () => {
    try {
      const response = await fetch(`${backendUrl}/servicemodels`);
      if (!response.ok) throw new Error("API error " + response.status);
      return await response.json();
    } catch (error) {
      console.error("getServies Error:", error);
      return null;
    }
  };

  const createServies = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/serviesmodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("createServies:", result);
      return result;
    } catch (error) {
      console.error("createServies Error:", error);
      return null;
    }
  };

  const updateServies = async (id, data) => {
    const response = await fetch(`${backendUrl}/serviesmodels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  const deleteServies = async (id) => {
    if (!id) throw new Error("No ID provided to deleteServies");
    try {
      const response = await fetch(`${backendUrl}/serviesmodels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("deleteServies Error:", error);
      return null;
    }
  };

  //worksection api
  const getWorkwithus = async () => {
    try {
      const response = await fetch(`${backendUrl}/workwithusmodels`);
      if (!response.ok) throw new Error("API error " + response.status);
      return await response.json();
    } catch (error) {
      console.error("getWorkwithus Error:", error);
      return null;
    }
  };

  const createWorkwithus = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/workwithusmodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("createWorkwithus:", result);
      return result;
    } catch (error) {
      console.error("createWorkwithus Error:", error);
      return null;
    }
  };

  const updateWorkwithus = async (id, data) => {
    const response = await fetch(`${backendUrl}/workwithusmodels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  const deleteWorkwithus = async (id) => {
    if (!id) throw new Error("No ID provided to deleteWorkwithus");
    try {
      const response = await fetch(`${backendUrl}/workwithusmodels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("deleteWorkwithus Error:", error);
      return null;
    }
  };

  //join us api
  const getJoinus = async () => {
    try {
      const response = await fetch(`${backendUrl}/joinusmodels`);
      if (!response.ok) throw new Error("API error " + response.status);
      return await response.json();
    } catch (error) {
      console.error("getjoinus Error:", error);
      return null;
    }
  };

  const createJoinus = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/joinusmodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("createjoinus:", result);
      return result;
    } catch (error) {
      console.error("createjoinus Error:", error);
      return null;
    }
  };

  const updateJoinus = async (id, data) => {
    const response = await fetch(`${backendUrl}/joinusmodels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  const deleteJoinus = async (id) => {
    if (!id) throw new Error("No ID provided to deletejoinus");
    try {
      const response = await fetch(`${backendUrl}/joinusmodels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("deletejoinus Error:", error);
      return null;
    }
  };

  //blogs api

  const getblogs = async () => {
    try {
      const response = await fetch(`${backendUrl}/blogmodels`);
      if (!response.ok) throw new Error("API error " + response.status);
      return await response.json();
    } catch (error) {
      console.error("getblogs Error:", error);
      return null;
    }
  };

  const createblogs = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/blogmodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("createblogs:", result);
      return result;
    } catch (error) {
      console.error("createblogs Error:", error);
      return null;
    }
  };

  const updateblogs = async (id, data) => {
    const response = await fetch(`${backendUrl}/blogmodels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  const deleteblogs = async (id) => {
    if (!id) throw new Error("No ID provided to deleteblogs");
    try {
      const response = await fetch(`${backendUrl}/blogmodels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("deleteblogs Error:", error);
      return null;
    }
  };

  //Footer apis

  const getFooter = async () => {
    try {
      const response = await fetch(`${backendUrl}/footermodels`);
      if (!response.ok) throw new Error("API error " + response.status);
      return await response.json();
    } catch (error) {
      console.error("getFooter Error:", error);
      return null;
    }
  };

  const createFooter = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/footermodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("createFooter:", result);
      return result;
    } catch (error) {
      console.error("createFooter Error:", error);
      return null;
    }
  };

  const updateFooter = async (id, data) => {
    const response = await fetch(`${backendUrl}/footermodels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  const deleteFooter = async (id) => {
    if (!id) throw new Error("No ID provided to deleteFooter");
    try {
      const response = await fetch(`${backendUrl}/footermodels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("deleteFooter Error:", error);
      return null;
    }
  };

  //reviews apis

  const getreviews = async () => {
    try {
      const response = await fetch(`${backendUrl}/reviewsmodels`);
      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("getreviews Error:", error.message);
      return [];
    }
  };

  const createreviews = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/reviewsmodels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create: ${response.status} - ${errorText}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("createreviews Error:", error.message);
      return null;
    }
  };

  const updatereviews = async (id, data) => {
    try {
      const response = await fetch(`${backendUrl}/reviewsmodels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Failed to update: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("updatereviews Error:", error.message);
    }
  };

  const deletereviews = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/reviewsmodels/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("deletereviews Error:", error.message);
    }
  };

  return (
    <Appcontext.Provider
      value={{
        //navbar
        getNavbar,
        createNavbar,
        updateNavbar,
        deleteNavbar,
        //home
        getHome,
        createHome,
        updateHome,
        deleteHome,
        //about
        getAboutus,
        createAboutus,
        updateAboutus,
        deleteAboutus,
        //servies
        getServies,
        createServies,
        updateServies,
        deleteServies,
        //componies
        getcomponies,
        createcomponies,
        updatecomponies,
        deletecomponies,
        //Workwithus
        getWorkwithus,
        createWorkwithus,
        updateWorkwithus,
        deleteWorkwithus,
        // Join us
        getJoinus,
        createJoinus,
        updateJoinus,
        deleteJoinus,
        //Reviews

        //blogs
        getblogs,
        createblogs,
        updateblogs,
        deleteblogs,
        //footer
        getFooter,
        createFooter,
        updateFooter,
        deleteFooter,
        //reviews
        getreviews,
        createreviews,
        updatereviews,
        deletereviews,

        login,
        logout,
      }}
    >
      {children}
    </Appcontext.Provider>
  );
};

export default AppProvider;
