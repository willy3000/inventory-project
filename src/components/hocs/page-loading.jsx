// components/LoadingSpinner.js
export default function PageLoading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.7)",
        zIndex: 1000,
      }}
    >
      <div>Loading...</div>
    </div>
  );
}
