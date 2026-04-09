import React from 'react';
import { Award, Star, Zap, Shield, Heart, Microscope } from 'lucide-react';

export function GamificationBadges() {
  const badges = [
    { id: 1, name: 'Sinais Vitais', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', level: 'Especialista', progress: 100 },
    { id: 2, name: 'Biossegurança', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50', level: 'Avançado', progress: 85 },
    { id: 3, name: 'Anatomia', icon: Microscope, color: 'text-purple-500', bg: 'bg-purple-50', level: 'Iniciante', progress: 40 },
    { id: 4, name: 'Ética Profissional', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50', level: 'Intermediário', progress: 60 },
  ];

  return (
    <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          Selos de Competência
        </h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase">Nível 12</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="p-4 rounded-sm border border-gray-50 bg-gray-50/50 space-y-3 group hover:border-[#E31E24]/20 transition-colors">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-sm ${badge.bg}`}>
                <badge.icon className={`w-5 h-5 ${badge.color}`} />
              </div>
              {badge.progress === 100 && (
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 truncate">{badge.name}</p>
              <p className="text-[10px] text-gray-500">{badge.level}</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-gray-400">
                <span>Progresso</span>
                <span>{badge.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${badge.progress === 100 ? 'bg-green-500' : 'bg-[#E31E24]'}`}
                  style={{ width: `${badge.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-2 text-xs font-bold text-gray-500 hover:text-[#E31E24] transition-colors">
        Ver Todas Conquistas
      </button>
    </div>
  );
}
