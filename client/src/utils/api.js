export const compareProducts = async (query, token) => {
    try {
      const res = await fetch("http://localhost:5000/api/products/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Comparison failed");
  
      return data; // { productA, productB }
    } catch (error) {
      console.error("Compare API error:", error.message);
      return null;
    }
  };
  