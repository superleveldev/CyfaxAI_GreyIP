import SidebarContent from "@/components/sidebar-content";

const Sidebar = () => {
  return (
    <div className="hidden h-[calc(100vh-80px)] flex-none overflow-y-auto bg-[#13101c] px-4 lg:block lg:w-[280px]">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
