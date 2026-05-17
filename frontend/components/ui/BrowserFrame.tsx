'use client';

interface BrowserFrameProps {
  title?: string;
  url?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export default function BrowserFrame({
  title = 'TestiFlow Dashboard',
  url = 'app.testiflow.site',
  children,
  className = '',
  dark = false,
}: BrowserFrameProps) {
  return (
    <div className={`rounded-xl overflow-hidden border shadow-2xl ${
        dark ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'
      } ${className}`}>
      <div className={`flex items-center gap-2 px-4 py-2.5 border-b text-xs ${
          dark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
        }`}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className={`flex-1 mx-3 px-3 py-1 rounded-md font-mono truncate ${
            dark ? 'bg-slate-900 text-slate-400' : 'bg-white text-gray-500 border border-gray-200'
          }`}>
          {url}
        </div>
        <span className={dark ? 'text-slate-500' : 'text-gray-400'}>{title}</span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
