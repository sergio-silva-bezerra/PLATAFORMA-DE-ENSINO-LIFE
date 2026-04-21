import React, { useEffect, useState } from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { auth, logOut, getUserProfile } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title: defaultTitle = "Admin Central", subtitle: defaultSubtitle = "Gestor" }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await getUserProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };

  const displayName = profile?.name || user?.displayName || defaultTitle;
  const displayRole = profile?.role 
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) 
    : defaultSubtitle;

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="relative w-96 text-gray-400">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Pesquisar..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24] transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-sm transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-tight">{displayRole}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 hover:border-[#E31E24]/20 hover:bg-red-50 transition-all group"
            title="Sair"
          >
            {user ? (
              <LogOut className="text-gray-400 w-5 h-5 group-hover:text-[#E31E24]" />
            ) : (
              <User className="text-gray-400 w-6 h-6 group-hover:text-[#E31E24]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
