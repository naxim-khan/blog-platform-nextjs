import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <main 
        className="bg-white flex-1 min-h-screen overflow-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 pt-17 sm:pt-16 md:pt-20"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
        }}
      >
        <div className="w-full max-w-full mx-auto px-0 sm:px-1 md:px-2">
          {children}
        </div>
      </main>
    </div>
  );
}