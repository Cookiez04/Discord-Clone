
import React, { useState, useEffect, useRef } from 'react';
import { Server, Channel } from '../types';
import { Hash, Volume2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  servers: Server[];
  onSelectChannel: (serverId: string, channelId: string) => void;
}

export const QuickSwitcher: React.FC<Props> = ({ isOpen, onClose, servers, onSelectChannel }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten structure for searching
  const allChannels = servers.flatMap(server => 
    server.channels.map(channel => ({
      server,
      channel
    }))
  );

  const filtered = allChannels.filter(({ channel, server }) => {
      const search = query.toLowerCase();
      return channel.name.toLowerCase().includes(search) || server.name.toLowerCase().includes(search);
  }).slice(0, 10); // Limit to 10 results

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          const { server, channel } = filtered[selectedIndex];
          onSelectChannel(server.id, channel.id);
          onClose();
        }
      } else if (e.key === 'Escape') {
          onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onSelectChannel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center pt-20" onClick={onClose}>
      <div 
        className="w-[570px] bg-[#2f3136] rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-[#202225] text-discord-text-normal text-xl px-4 py-3 rounded focus:outline-none placeholder-[#72767d]"
            placeholder="Where would you like to go?"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
          />
          <div className="mt-2 text-xs font-bold text-[#b9bbbe] uppercase tracking-wide">
              {query ? 'Search Results' : 'Recent Channels'}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[400px] pb-2 custom-scrollbar">
            {filtered.length === 0 && (
                <div className="p-8 text-center text-discord-text-muted">
                    No results found matching "{query}"
                </div>
            )}
            {filtered.map((item, idx) => (
                <div 
                    key={`${item.server.id}-${item.channel.id}`}
                    className={`mx-2 px-4 py-2 rounded flex items-center cursor-pointer ${idx === selectedIndex ? 'bg-[#40444b]' : 'hover:bg-[#36393f]'}`}
                    onClick={() => {
                        onSelectChannel(item.server.id, item.channel.id);
                        onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                >
                    <div className="mr-3 text-[#b9bbbe]">
                        {item.channel.type === 'voice' ? <Volume2 size={20} /> : <Hash size={20} />}
                    </div>
                    <div className="flex-1">
                        <div className={`font-medium ${idx === selectedIndex ? 'text-white' : 'text-[#b9bbbe]'}`}>
                            {item.channel.name}
                        </div>
                        <div className="text-xs text-[#72767d]">
                            {item.server.name}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="bg-[#292b2f] p-2 text-[11px] text-[#b9bbbe] flex justify-between px-4 border-t border-[#202225]">
            <div>
                <span className="font-bold mr-1">PROTIP:</span>
                Start searches with <span className="bg-[#202225] px-1 rounded">#</span> to search for channels
            </div>
            <div>
                <span className="bg-[#202225] px-1 rounded mr-1">return</span>
                to select
            </div>
        </div>
      </div>
    </div>
  );
};
