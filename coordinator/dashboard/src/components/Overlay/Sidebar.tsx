import React from 'react';
import { AiOutlineHome, AiOutlineTeam, AiOutlineSetting, AiOutlineInfoCircle } from 'react-icons/ai';
import { BsCpu } from 'react-icons/bs';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { IconType } from 'react-icons';

interface MenuItem {
  name: string;
  icon: IconType;
}

const Sidebar: React.FC = () => {
  const menuItems: MenuItem[] = [
    { name: 'Home', icon: AiOutlineHome },
    { name: 'Workers', icon: AiOutlineTeam },
    { name: 'Models', icon: BsCpu },
    { name: 'Settings', icon: AiOutlineSetting },
    { name: 'About', icon: AiOutlineInfoCircle },
    { name: 'Guide', icon: HiOutlineBookOpen }
  ];

  return (
    <div className="h-screen top-0 left-0 fixed w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 shadow-2xl border-r border-slate-700">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          KokoroDo
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-2">
          {menuItems.map((item: MenuItem, index: number) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.name}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
              >
                <IconComponent 
                  size={20} 
                  className="group-hover:text-blue-400 transition-colors duration-200" 
                />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom decoration */}
      <div className="mt-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-4"></div>
        <div className="text-xs text-slate-500 text-center">
          © 2025 KokoroDo
        </div>
      </div>
    </div>
  );
};

export default Sidebar;