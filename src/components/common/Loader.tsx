// מצב טעינה: עיגול מסתובב
function Loader() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-muted" role="status">
      <div className="size-10 animate-spin rounded-full border-4 border-line border-t-coral" />
      <span className="font-hand">טוען...</span>
    </div>
  );
}

export default Loader;
