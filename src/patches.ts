if (import.meta.env.VITE_DEBUG !== "true") {
  console.debug = () => {};
}