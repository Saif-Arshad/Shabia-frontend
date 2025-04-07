import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children, className, ...props }) => {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform transform-translate-x-0 dark:bg-gray-800 dark:border-gray-700",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
      {...props}
    >
      <div className="p-4">
        <Button variant="ghost" onClick={onClose}>
          Close Sidebar
        </Button>
      </div>
      {children}
    </aside>
  );
};

export default Sidebar;
