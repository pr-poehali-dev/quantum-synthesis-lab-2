import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const SERVERS = [
  { id: 1, label: "🏠", name: "Мой сервер" },
  { id: 2, label: "🎮", name: "Игровой клуб" },
  { id: 3, label: "🎨", name: "Арт-студия" },
  { id: 4, label: "💬", name: "Болталка" },
  { id: 5, label: "🎵", name: "Музыкальная" },
];

const SERVER_CHANNELS: Record<number, { name: string; unread: boolean }[]> = {
  1: [{ name: "общий", unread: true }, { name: "новости", unread: false }, { name: "знакомства", unread: false }, { name: "помощь", unread: true }, { name: "оффтоп", unread: false }],
  2: [{ name: "поиск-тиммейтов", unread: true }, { name: "стратегии", unread: false }, { name: "читы-жалобы", unread: false }, { name: "скриншоты", unread: true }],
  3: [{ name: "галерея", unread: false }, { name: "вдохновение", unread: true }, { name: "критика", unread: false }, { name: "инструменты", unread: false }],
  4: [{ name: "общий", unread: true }, { name: "мемы", unread: true }, { name: "жизнь", unread: false }, { name: "случайное", unread: false }],
  5: [{ name: "рекомендации", unread: false }, { name: "плейлисты", unread: true }, { name: "новинки", unread: false }, { name: "концерты", unread: false }],
};

const VOICE_CHANNELS = ["Голосовой", "Музыка", "AFK"];

const GAMES = [
  { id: 1, title: "Minecraft", genre: "Песочница", emoji: "⛏️", players: "127М игроков", color: "#5d7a3e", desc: "Строй, исследуй и выживай в бесконечном мире." },
  { id: 2, title: "Valorant", genre: "Шутер", emoji: "🎯", players: "14М игроков", color: "#e84057", desc: "Тактический шутер от первого лица с уникальными агентами." },
  { id: 3, title: "Genshin Impact", genre: "RPG", emoji: "⚔️", players: "60М игроков", color: "#c77dff", desc: "Открытый мир с элементальной магией и захватывающим сюжетом." },
];

const SONGS = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", emoji: "🌃" },
  { id: 2, title: "Shape of You", artist: "Ed Sheeran", duration: "3:53", emoji: "❤️" },
  { id: 3, title: "Levitating", artist: "Dua Lipa", duration: "3:23", emoji: "🪐" },
  { id: 4, title: "Stay", artist: "Kid LAROI & Justin Bieber", duration: "2:21", emoji: "💫" },
  { id: 5, title: "Peaches", artist: "Justin Bieber", duration: "3:18", emoji: "🍑" },
  { id: 6, title: "Good 4 U", artist: "Olivia Rodrigo", duration: "2:58", emoji: "🎸" },
  { id: 7, title: "Montero", artist: "Lil Nas X", duration: "2:17", emoji: "🐍" },
  { id: 8, title: "Dynamite", artist: "BTS", duration: "3:19", emoji: "💥" },
  { id: 9, title: "Save Your Tears", artist: "The Weeknd", duration: "3:36", emoji: "😢" },
  { id: 10, title: "Drivers License", artist: "Olivia Rodrigo", duration: "4:02", emoji: "🚗" },
  { id: 11, title: "Bad Guy", artist: "Billie Eilish", duration: "3:14", emoji: "😈" },
  { id: 12, title: "Watermelon Sugar", artist: "Harry Styles", duration: "2:54", emoji: "🍉" },
  { id: 13, title: "Circles", artist: "Post Malone", duration: "3:35", emoji: "🔄" },
  { id: 14, title: "Memories", artist: "Maroon 5", duration: "3:09", emoji: "📷" },
  { id: 15, title: "Señorita", artist: "Shawn Mendes & Camila Cabello", duration: "3:13", emoji: "💃" },
  { id: 16, title: "Without Me", artist: "Halsey", duration: "3:18", emoji: "🌙" },
  { id: 17, title: "Happier", artist: "Marshmello & Bastille", duration: "3:34", emoji: "😊" },
  { id: 18, title: "Someone You Loved", artist: "Lewis Capaldi", duration: "3:02", emoji: "💔" },
  { id: 19, title: "Sucker", artist: "Jonas Brothers", duration: "3:01", emoji: "🎪" },
  { id: 20, title: "7 Rings", artist: "Ariana Grande", duration: "2:58", emoji: "💍" },
  { id: 21, title: "Old Town Road", artist: "Lil Nas X", duration: "1:53", emoji: "🤠" },
  { id: 22, title: "Sunflower", artist: "Post Malone", duration: "2:38", emoji: "🌻" },
  { id: 23, title: "As It Was", artist: "Harry Styles", duration: "2:37", emoji: "✨" },
];

const THEMES = [
  { id: "light", label: "Светлая", emoji: "☀️", bg: "#f2f3f5", sidebar: "#e3e5e8", chat: "#ffffff", text: "#060607" },
  { id: "dark", label: "Тёмная", emoji: "🌙", bg: "#313338", sidebar: "#2b2d31", chat: "#36393f", text: "#ffffff" },
  { id: "colorful", label: "Цветная", emoji: "🌈", bg: "#fdf4ff", sidebar: "#e9d5ff", chat: "#ffffff", text: "#3b0764" },
];

const WALLPAPERS = [
  { id: 1, label: "Космос", emoji: "🌌", gradient: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)" },
  { id: 2, label: "Закат", emoji: "🌅", gradient: "linear-gradient(135deg,#f093fb,#f5576c,#fda085)" },
  { id: 3, label: "Океан", emoji: "🌊", gradient: "linear-gradient(135deg,#667eea,#764ba2,#06beb6)" },
  { id: 4, label: "Лес", emoji: "🌲", gradient: "linear-gradient(135deg,#134e5e,#71b280,#a8edea)" },
];

const MEMBERS_ONLINE = [
  { name: "Александра", status: "В сети", avatar: "А", color: "#5865f2" },
  { name: "Максим", status: "Не беспокоить", avatar: "М", color: "#ed4245" },
  { name: "Катя", status: "Отошёл", avatar: "К", color: "#faa61a" },
];
const MEMBERS_OFFLINE = [
  { name: "Дмитрий", avatar: "Д", color: "#4e5058" },
  { name: "Алина", avatar: "А", color: "#4e5058" },
];
const STATUS_COLORS: Record<string, string> = {
  "В сети": "#23a55a", "Не беспокоить": "#ed4245", "Отошёл": "#f0b232",
};
const CHANNEL_MESSAGES = [
  { id: 1, author: "Александра", avatar: "А", color: "#5865f2", time: "Сегодня в 10:42", text: "Всем привет! Как дела? 👋" },
  { id: 2, author: "Максим", avatar: "М", color: "#ed4245", time: "Сегодня в 10:43", text: "Привет! Отлично, только что запустил новый проект 🚀" },
  { id: 3, author: "Катя", avatar: "К", color: "#faa61a", time: "Сегодня в 10:45", text: "Ребята, кто смотрел последний стрим? Там было что-то невероятное!" },
  { id: 4, author: "Александра", avatar: "А", color: "#5865f2", time: "Сегодня в 10:47", text: "Да, я смотрела! Вообще огонь 🔥" },
  { id: 5, author: "Максим", avatar: "М", color: "#ed4245", time: "Сегодня в 10:50", text: "Буду! Кто ещё идёт?" },
];

type Message = { id: number; author: string; avatar: string; color: string; time: string; text: string };
type DmChats = Record<string, Message[]>;

const DM_GREETINGS: Record<string, string> = {
  "Александра": "Привет! Чем могу помочь? 😊",
  "Максим": "Привет! Что хотел спросить?",
  "Катя": "Привееет! 🌸",
  "Дмитрий": "Привет.",
  "Алина": "Привет! Я сейчас не очень активна, но отвечу 😊",
};

function getTime() {
  const now = new Date();
  return `Сегодня в ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default function Index() {
  const [activeServer, setActiveServer] = useState(1);
  const [activeChannel, setActiveChannel] = useState(SERVER_CHANNELS[1][0].name);
  const [activeDm, setActiveDm] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [channelMessages, setChannelMessages] = useState(CHANNEL_MESSAGES);
  const [dmChats, setDmChats] = useState<DmChats>({});
  const [typing, setTyping] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [activeTheme, setActiveTheme] = useState("light");
  const [activeWallpaper, setActiveWallpaper] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages, dmChats, activeDm]);

  const allMembers = [...MEMBERS_ONLINE, ...MEMBERS_OFFLINE];
  const theme = THEMES.find(t => t.id === activeTheme) || THEMES[0];
  const wallpaper = activeWallpaper !== null ? WALLPAPERS.find(w => w.id === activeWallpaper) : null;

  const openDm = (name: string) => {
    setActiveDm(name); setSidebarOpen(false);
    if (!dmChats[name]) {
      const member = allMembers.find(m => m.name === name)!;
      setDmChats(prev => ({ ...prev, [name]: [{ id: 1, author: name, avatar: member.avatar, color: member.color, time: getTime(), text: DM_GREETINGS[name] || "Привет!" }] }));
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim(); setInputValue("");
    if (activeDm) {
      const member = allMembers.find(m => m.name === activeDm)!;
      const myMsg: Message = { id: Date.now(), author: "Пользователь", avatar: "Я", color: "#5865f2", time: getTime(), text };
      setDmChats(prev => ({ ...prev, [activeDm]: [...(prev[activeDm] || []), myMsg] }));
      setTyping(true);
      setTimeout(() => {
        const replies = ["Интересно! Расскажи подробнее 🙂", "Понял тебя, хорошая мысль!", "Ага, согласен 👍", "Хм, надо подумать...", "Отлично!", "Окей 😊", "Да, именно так!", "Не совсем понял, объясни?"];
        const reply: Message = { id: Date.now() + 1, author: activeDm, avatar: member.avatar, color: member.color, time: getTime(), text: replies[Math.floor(Math.random() * replies.length)] };
        setDmChats(prev => ({ ...prev, [activeDm]: [...(prev[activeDm] || []), reply] }));
        setTyping(false);
      }, 1000 + Math.random() * 1000);
    } else {
      setChannelMessages(prev => [...prev, { id: Date.now(), author: "Пользователь", avatar: "Я", color: "#5865f2", time: getTime(), text }]);
    }
  };

  const currentMessages = activeDm ? (dmChats[activeDm] || []) : channelMessages;
  const currentMember = activeDm ? allMembers.find(m => m.name === activeDm) : null;

  // Специальный контент для серверов
  const isGaming = activeServer === 2;
  const isArt = activeServer === 3;
  const isMusic = activeServer === 5;
  const isSpecial = isGaming || isArt || isMusic;

  const sidebarBg = activeTheme === "dark" ? "#2b2d31" : activeTheme === "colorful" ? "#e9d5ff" : "#e3e5e8";
  const chatBg = wallpaper ? "transparent" : (activeTheme === "dark" ? "#313338" : activeTheme === "colorful" ? "#fdf4ff" : "#f2f3f5");
  const textMain = activeTheme === "dark" ? "#f2f3f5" : activeTheme === "colorful" ? "#3b0764" : "#060607";
  const textMuted = activeTheme === "dark" ? "#949ba4" : activeTheme === "colorful" ? "#7e22ce" : "#4e5058";
  const headerBg = activeTheme === "dark" ? "#1e1f22" : activeTheme === "colorful" ? "#f3e8ff" : "#ffffff";
  const msgHover = activeTheme === "dark" ? "#2e3035" : activeTheme === "colorful" ? "#f3e8ff" : "#e9eaec";
  const inputBg = activeTheme === "dark" ? "#383a40" : activeTheme === "colorful" ? "#f3e8ff" : "#e9eaec";

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: chatBg }}>
      {/* Обои */}
      {wallpaper && (
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ background: wallpaper.gradient }} />
      )}

      {/* Сайдбар серверов */}
      <div className="w-[72px] flex flex-col items-center py-3 gap-2 flex-shrink-0 z-20" style={{ background: sidebarBg }}>
        {SERVERS.map((s) => (
          <button key={s.id}
            onClick={() => { setActiveServer(s.id); setActiveDm(null); setActiveChannel(SERVER_CHANNELS[s.id][0].name); }}
            className={`w-12 h-12 flex items-center justify-center text-xl transition-all duration-200 relative
              ${s.id === activeServer ? "bg-[#5865f2] rounded-2xl" : "bg-white/80 rounded-3xl hover:rounded-2xl hover:bg-[#5865f2]"}`}
          >
            {s.id === activeServer && <div className="absolute left-0 w-1 h-8 bg-black/30 rounded-r-full -translate-x-[4px]" />}
            {s.label}
          </button>
        ))}
        <div className="w-8 h-px bg-black/10 my-1" />
        <button className="w-12 h-12 bg-white/80 rounded-3xl hover:rounded-2xl hover:bg-[#23a55a] flex items-center justify-center transition-all duration-200 text-[#23a55a] hover:text-white text-xl font-bold">+</button>
      </div>

      {/* Сайдбар каналов */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 absolute md:relative z-10 w-60 flex flex-col h-full transition-transform duration-200`}
        style={{ background: sidebarBg }}>
        <div className="px-4 py-3 border-b border-black/10 flex items-center justify-between shadow-sm">
          <h2 className="font-bold text-base truncate" style={{ color: textMain }}>{SERVERS.find(s => s.id === activeServer)?.name}</h2>
          <Icon name="ChevronDown" size={18} style={{ color: textMuted }} />
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {Object.keys(dmChats).length > 0 && (
            <div className="mb-3">
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>Личные сообщения</div>
              {Object.keys(dmChats).map((name) => {
                const m = allMembers.find(x => x.name === name)!;
                return (
                  <button key={name} onClick={() => { setActiveDm(name); setSidebarOpen(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors hover:bg-black/10"
                    style={{ color: activeDm === name ? textMain : textMuted, fontWeight: activeDm === name ? 600 : 400 }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: m?.color }}>{m?.avatar}</div>
                    <span className="truncate">{name}</span>
                  </button>
                );
              })}
              <div className="h-px bg-black/10 my-2" />
            </div>
          )}
          <div className="mb-1">
            <div className="flex items-center gap-1 px-2 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>
              <Icon name="ChevronDown" size={12} /><span>Текстовые каналы</span>
            </div>
            {SERVER_CHANNELS[activeServer].map((ch) => (
              <button key={ch.name} onClick={() => { setActiveChannel(ch.name); setActiveDm(null); setSidebarOpen(false); }}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors hover:bg-black/10"
                style={{ color: !activeDm && activeChannel === ch.name ? textMain : textMuted, fontWeight: !activeDm && activeChannel === ch.name ? 600 : 400 }}>
                <Icon name="Hash" size={16} />
                <span className="flex-1 text-left">{ch.name}</span>
                {ch.unread && (activeChannel !== ch.name || activeDm) && <div className="w-2 h-2 bg-current rounded-full opacity-60" />}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1 px-2 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>
              <Icon name="ChevronDown" size={12} /><span>Голосовые каналы</span>
            </div>
            {VOICE_CHANNELS.map((ch) => (
              <button key={ch} className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-sm transition-colors hover:bg-black/10" style={{ color: textMuted }}>
                <Icon name="Volume2" size={16} /><span>{ch}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-2 border-t border-black/10 flex items-center gap-2" style={{ background: activeTheme === "dark" ? "#1e1f22" : "rgba(0,0,0,0.05)" }}>
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center"><span className="text-white text-sm font-semibold">Я</span></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#23a55a] border-2 rounded-full" style={{ borderColor: sidebarBg }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: textMain }}>Пользователь</div>
            <div className="text-xs" style={{ color: textMuted }}>В сети</div>
          </div>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/10 transition-colors" style={{ color: textMuted }}><Icon name="Mic" size={15} /></button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/10 transition-colors" style={{ color: textMuted }}><Icon name="Settings" size={15} /></button>
          </div>
        </div>
      </div>

      {/* Основная область */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Шапка */}
        <div className="h-12 border-b border-black/10 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm" style={{ background: headerBg }}>
          <button className="md:hidden mr-1" style={{ color: textMuted }} onClick={() => setSidebarOpen(!sidebarOpen)}><Icon name="Menu" size={20} /></button>
          {activeDm && currentMember ? (
            <>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: currentMember.color }}>{currentMember.avatar}</div>
              <span className="font-bold" style={{ color: textMain }}>{activeDm}</span>
              <div className="w-px h-5 bg-black/10 mx-1 hidden sm:block" />
              <span className="text-sm hidden sm:block" style={{ color: textMuted }}>{MEMBERS_ONLINE.find(m => m.name === activeDm)?.status ?? "Не в сети"}</span>
            </>
          ) : (
            <>
              {isGaming ? <span className="text-xl">🎮</span> : isArt ? <span className="text-xl">🎨</span> : isMusic ? <span className="text-xl">🎵</span> : <Icon name="Hash" size={20} style={{ color: textMuted }} />}
              <span className="font-bold" style={{ color: textMain }}>{isGaming ? "Игры" : isArt ? "Темы и обои" : isMusic ? "Плеер" : activeChannel}</span>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            <button style={{ color: textMuted }}><Icon name="Users" size={20} /></button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col min-w-0">

            {/* === ИГРЫ === */}
            {isGaming && !activeDm && (
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: textMain }}>🎮 Игровой клуб</h2>
                <p className="text-sm mb-6" style={{ color: textMuted }}>Выбери игру и присоединяйся к сообществу</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {GAMES.map(game => (
                    <div key={game.id} className="rounded-2xl overflow-hidden border border-black/10 hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="h-28 flex items-center justify-center text-6xl" style={{ background: game.color + "33" }}>{game.emoji}</div>
                      <div className="p-4" style={{ background: headerBg }}>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-base" style={{ color: textMain }}>{game.title}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: game.color + "22", color: game.color }}>{game.genre}</span>
                        </div>
                        <p className="text-xs mb-3" style={{ color: textMuted }}>{game.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ color: textMuted }}>👥 {game.players}</span>
                          <button className="text-xs px-3 py-1 rounded-full text-white font-semibold" style={{ background: game.color }}>Играть</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === МУЗЫКА === */}
            {isMusic && !activeDm && (
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: textMain }}>🎵 Плеер</h2>
                <p className="text-sm mb-4" style={{ color: textMuted }}>23 трека · Нажми для воспроизведения</p>
                <div className="space-y-1">
                  {SONGS.map((song, i) => (
                    <button key={song.id} onClick={() => setPlayingId(playingId === song.id ? null : song.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group"
                      style={{ background: playingId === song.id ? "#5865f222" : "transparent" }}
                      onMouseEnter={e => (e.currentTarget.style.background = playingId === song.id ? "#5865f222" : msgHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = playingId === song.id ? "#5865f222" : "transparent")}
                    >
                      <div className="w-8 text-center flex-shrink-0">
                        {playingId === song.id
                          ? <span className="text-[#5865f2] font-bold text-sm">▶</span>
                          : <span className="text-sm" style={{ color: textMuted }}>{i + 1}</span>
                        }
                      </div>
                      <span className="text-xl flex-shrink-0">{song.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: playingId === song.id ? "#5865f2" : textMain }}>{song.title}</div>
                        <div className="text-xs truncate" style={{ color: textMuted }}>{song.artist}</div>
                      </div>
                      <span className="text-xs flex-shrink-0" style={{ color: textMuted }}>{song.duration}</span>
                    </button>
                  ))}
                </div>
                {playingId && (
                  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-4 z-50" style={{ background: headerBg, border: "1px solid rgba(0,0,0,0.1)" }}>
                    <span className="text-2xl">{SONGS.find(s => s.id === playingId)?.emoji}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ color: textMain }}>{SONGS.find(s => s.id === playingId)?.title}</div>
                      <div className="text-xs" style={{ color: textMuted }}>{SONGS.find(s => s.id === playingId)?.artist}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="text-lg text-[#5865f2]">⏮</button>
                      <button onClick={() => setPlayingId(null)} className="w-9 h-9 rounded-full bg-[#5865f2] text-white flex items-center justify-center text-base">⏸</button>
                      <button className="text-lg text-[#5865f2]">⏭</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* === АРТ: ТЕМЫ И ОБОИ === */}
            {isArt && !activeDm && (
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-6" style={{ color: textMain }}>🎨 Темы и оформление</h2>

                <div className="mb-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textMuted }}>Тема интерфейса</h3>
                  <div className="flex gap-3 flex-wrap">
                    {THEMES.map(t => (
                      <button key={t.id} onClick={() => setActiveTheme(t.id)}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
                        style={{ borderColor: activeTheme === t.id ? "#5865f2" : "transparent", background: t.bg }}>
                        <div className="w-16 h-10 rounded-lg border border-black/10 overflow-hidden flex">
                          <div className="w-5 h-full" style={{ background: t.sidebar }} />
                          <div className="flex-1" style={{ background: t.chat }} />
                        </div>
                        <span className="text-xs font-medium" style={{ color: t.text }}>{t.emoji} {t.label}</span>
                        {activeTheme === t.id && <div className="w-2 h-2 bg-[#5865f2] rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textMuted }}>Обои чата</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button onClick={() => setActiveWallpaper(null)}
                      className="h-24 rounded-xl border-2 flex items-center justify-center text-sm font-medium transition-all"
                      style={{ borderColor: activeWallpaper === null ? "#5865f2" : "rgba(0,0,0,0.1)", background: headerBg, color: textMuted }}>
                      Без обоев
                    </button>
                    {WALLPAPERS.map(w => (
                      <button key={w.id} onClick={() => setActiveWallpaper(w.id)}
                        className="h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all"
                        style={{ background: w.gradient, borderColor: activeWallpaper === w.id ? "#fff" : "transparent" }}>
                        <span className="text-2xl">{w.emoji}</span>
                        <span className="text-xs text-white font-medium drop-shadow">{w.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === ОБЫЧНЫЙ ЧАТ === */}
            {!isSpecial && (
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                <div className="mb-6 pb-4 border-b border-black/10">
                  {activeDm && currentMember ? (
                    <>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3" style={{ background: currentMember.color }}>{currentMember.avatar}</div>
                      <h2 className="text-2xl font-bold mb-1" style={{ color: textMain }}>{activeDm}</h2>
                      <p className="text-sm" style={{ color: textMuted }}>Начало разговора с <strong>{activeDm}</strong>.</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: inputBg }}>
                        <Icon name="Hash" size={24} style={{ color: textMuted }} />
                      </div>
                      <h2 className="text-2xl font-bold mb-1" style={{ color: textMain }}>Добро пожаловать в #{activeChannel}!</h2>
                      <p className="text-sm" style={{ color: textMuted }}>Это начало канала #{activeChannel}.</p>
                    </>
                  )}
                </div>
                {currentMessages.map((msg, i) => {
                  const isGrouped = i > 0 && currentMessages[i - 1].author === msg.author;
                  return (
                    <div key={msg.id} className={`flex gap-3 group rounded px-2 py-0.5 transition-colors ${isGrouped ? "" : "mt-4"}`}
                      onMouseEnter={e => (e.currentTarget.style.background = msgHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      {!isGrouped ? (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-semibold text-sm" style={{ background: msg.color }}>{msg.avatar}</div>
                      ) : (
                        <div className="w-10 flex-shrink-0 flex items-center justify-end">
                          <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: textMuted }}>{msg.time.split(" ").slice(-2).join(" ")}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {!isGrouped && (
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="font-semibold text-sm" style={{ color: textMain }}>{msg.author}</span>
                            <span className="text-xs" style={{ color: textMuted }}>{msg.time}</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed" style={{ color: activeTheme === "dark" ? "#dbdee1" : textMain }}>{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                {typing && activeDm && (
                  <div className="flex gap-3 px-2 py-1 mt-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm" style={{ background: currentMember?.color }}>{currentMember?.avatar}</div>
                    <div className="flex items-center gap-1 rounded-full px-4 py-2" style={{ background: inputBg }}>
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: textMuted, animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: textMuted, animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: textMuted, animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}

            {/* Поле ввода — только не для специальных серверов */}
            {(!isSpecial || activeDm) && (
              <div className="px-4 pb-4 flex-shrink-0">
                <div className="rounded-lg flex items-center gap-2 px-4 py-3" style={{ background: inputBg }}>
                  <button className="flex-shrink-0 transition-colors" style={{ color: textMuted }}><Icon name="Plus" size={20} /></button>
                  <input className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: textMain }}
                    placeholder={activeDm ? `Написать ${activeDm}` : `Написать в #${activeChannel}`}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()} />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button style={{ color: textMuted }}><Icon name="Smile" size={20} /></button>
                    <button onClick={sendMessage} style={{ color: inputValue ? "#5865f2" : textMuted }}><Icon name="Send" size={20} /></button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Панель участников */}
          {!isSpecial && (
            <div className="hidden lg:flex w-60 flex-col flex-shrink-0 overflow-y-auto px-3 py-4 border-l border-black/10" style={{ background: chatBg }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 px-2" style={{ color: textMuted }}>В сети — {MEMBERS_ONLINE.length}</h3>
              {MEMBERS_ONLINE.map((m) => (
                <button key={m.name} onClick={() => openDm(m.name)}
                  className="w-full flex items-center gap-3 px-2 py-1.5 rounded transition-colors group"
                  onMouseEnter={e => (e.currentTarget.style.background = msgHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ background: m.color }}>{m.avatar}</div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 rounded-full" style={{ background: STATUS_COLORS[m.status], borderColor: chatBg }} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-medium truncate group-hover:text-[#5865f2] transition-colors" style={{ color: textMain }}>{m.name}</div>
                    <div className="text-xs truncate" style={{ color: textMuted }}>{m.status}</div>
                  </div>
                  <Icon name="MessageSquare" size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: textMuted }} />
                </button>
              ))}
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 px-2 mt-4" style={{ color: textMuted }}>Не в сети — {MEMBERS_OFFLINE.length}</h3>
              {MEMBERS_OFFLINE.map((m) => (
                <button key={m.name} onClick={() => openDm(m.name)}
                  className="w-full flex items-center gap-3 px-2 py-1.5 rounded transition-colors opacity-50 hover:opacity-80"
                  onMouseEnter={e => (e.currentTarget.style.background = msgHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#4e5058] flex items-center justify-center text-white text-sm font-semibold">{m.avatar}</div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#80848e] border-2 rounded-full" style={{ borderColor: chatBg }} />
                  </div>
                  <div className="text-sm font-medium truncate" style={{ color: textMuted }}>{m.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
