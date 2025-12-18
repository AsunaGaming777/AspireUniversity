export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center constellation-bg">
      <div className="text-center">
        <div className="loading-dots mb-4">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="text-brand-muted-text">Loading...</p>
      </div>
    </div>
  )
}



