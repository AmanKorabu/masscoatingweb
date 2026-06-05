export default function WebsiteLoading() {
  return (
    <div className="fixed left-0 top-0 z-[999999] h-1 w-full overflow-hidden bg-transparent">
      <div className="h-full w-1/3 animate-page-loader rounded-r-full bg-blue-500" />
    </div>
  );
}