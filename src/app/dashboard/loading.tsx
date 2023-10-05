import LoadingSpinner from "@/components/basicElements/loadingSpinner";

export default function Loading() {
  return (
    <main style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 10rem)"
    }}>
      <LoadingSpinner />
    </main>
  )
}