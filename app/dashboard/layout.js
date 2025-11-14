import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen ">
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <main className="bg-white flex-1 min-h-screen overflow-auto px-3 md:px-8 pt-15"
       style={{
        backgroundImage:'url("https://www.transparenttextures.com/patterns/cubes.png")'
       }}
      >
        <div className="container mx-auto ">
          {children}
        </div>
      </main>
    </div>
  );
}