import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { SnakeGame, TicTacToe, QuizGame } from "@/components/Games";

const DEFAULT_SERVERS = [
  { id: 1, label: "🏠", name: "Мой сервер", isCustom: false },
  { id: 2, label: "🎮", name: "Игровой клуб", isCustom: false },
  { id: 3, label: "🎨", name: "Арт-студия", isCustom: false },
  { id: 4, label: "💬", name: "Болталка", isCustom: false },
  { id: 5, label: "🎵", name: "Музыкальная", isCustom: false },
];

const SERVER_CHANNELS: Record<number, { name: string; unread: boolean }[]> = {
  1: [{ name: "общий", unread: true }, { name: "новости", unread: false }, { name: "знакомства", unread: false }, { name: "помощь", unread: true }, { name: "оффтоп", unread: false }],
  2: [{ name: "поиск-тиммейтов", unread: true }, { name: "стратегии", unread: false }, { name: "читы-жалобы", unread: false }, { name: "скриншоты", unread: true }],
  3: [{ name: "галерея", unread: false }, { name: "вдохновение", unread: true }, { name: "критика", unread: false }, { name: "инструменты", unread: false }],
  4: [{ name: "общий", unread: true }, { name: "мемы", unread: true }, { name: "жизнь", unread: false }, { name: "случайное", unread: false }],
  5: [{ name: "рекомендации", unread: false }, { name: "плейлисты", unread: true }, { name: "новинки", unread: false }, { name: "концерты", unread: false }],
};

const VOICE_CHANNELS = ["Голосовой", "Музыка", "AFK"];

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
const DEFAULT_CHANNEL_MESSAGES = [
  { id: 1, author: "Александра", avatar: "А", color: "#5865f2", time: "Сегодня в 10:42", text: "Всем привет! Как дела? 👋", isVoice: false },
  { id: 2, author: "Максим", avatar: "М", color: "#ed4245", time: "Сегодня в 10:43", text: "Привет! Отлично, только что запустил новый проект 🚀", isVoice: false },
  { id: 3, author: "Катя", avatar: "К", color: "#faa61a", time: "Сегодня в 10:45", text: "Ребята, кто смотрел последний стрим? Там было что-то невероятное!", isVoice: false },
  { id: 4, author: "Александра", avatar: "А", color: "#5865f2", time: "Сегодня в 10:47", text: "Да, я смотрела! Вообще огонь 🔥", isVoice: false },
  { id: 5, author: "Максим", avatar: "М", color: "#ed4245", time: "Сегодня в 10:50", text: "Буду! Кто ещё идёт?", isVoice: false },
];

type Message = { id: number; author: string; avatar: string; color: string; time: string; text: string; isVoice?: boolean; audioUrl?: string };
type DmChats = Record<string, Message[]>;
type ServerItem = { id: number; label: string; name: string; isCustom: boolean };

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

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch (e) {
    void e;
  }
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    void e;
  }
}

const FOLDER_EMOJIS = ["📁", "🗂️", "📂", "🏷️", "⭐", "🔖", "💼", "🎯", "🔥", "💡"];

const GAMES_CATALOG = [
  { id: 1, title: "Змейка", emoji: "🐍", color: "#23a55a", desc: "Управляй змейкой, ешь еду и не врезайся. Скорость растёт!" },
  { id: 2, title: "Крестики-нолики", emoji: "❌", color: "#5865f2", desc: "Сыграй с другом или против умного ИИ." },
  { id: 3, title: "Викторина", emoji: "🧠", color: "#f0b232", desc: "10 вопросов, 15 секунд на каждый. Насколько ты умён?" },
];

function GamingHub({ headerBg, textMain, textMuted }: { headerBg: string; textMain: string; textMuted: string }) {
  const [activeGame, setActiveGame] = useState<number | null>(null);
  return (
    <div className="flex flex-col h-full">
      {activeGame === null ? (
        <>
          <h2 className="text-2xl font-bold mb-1" style={{ color: textMain }}>🎮 Игровой клуб</h2>
          <p className="text-sm mb-6" style={{ color: textMuted }}>Три мини-игры прямо в чате — выбери и играй!</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {GAMES_CATALOG.map(game => (
              <button key={game.id} onClick={() => setActiveGame(game.id)}
                className="rounded-2xl overflow-hidden border border-black/10 hover:shadow-xl transition-all text-left hover:scale-[1.02] active:scale-[0.98]">
                <div className="h-32 flex items-center justify-center text-7xl" style={{ background: game.color + "22" }}>{game.emoji}</div>
                <div className="p-4" style={{ background: headerBg }}>
                  <h3 className="font-bold text-base mb-1" style={{ color: textMain }}>{game.title}</h3>
                  <p className="text-xs mb-3" style={{ color: textMuted }}>{game.desc}</p>
                  <span className="text-xs font-semibold text-white px-4 py-1.5 rounded-full" style={{ background: game.color }}>Играть →</span>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <button onClick={() => setActiveGame(null)}
            className="self-start text-sm px-3 py-1 rounded-lg mb-2 hover:bg-black/10 transition-colors flex items-center gap-1"
            style={{ color: textMuted }}>
            ← Назад к играм
          </button>
          {activeGame === 1 && <SnakeGame />}
          {activeGame === 2 && <TicTacToe />}
          {activeGame === 3 && <QuizGame />}
        </div>
      )}
    </div>
  );
}

function VoiceMessagePlayer({ audioUrl, textMuted, inputBg }: { audioUrl: string; textMuted: string; inputBg: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-2 rounded-xl px-3 py-2 max-w-xs" style={{ background: inputBg }}>
      <audio ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => {
          if (audioRef.current) setProgress((audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100);
        }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={() => { setPlaying(false); setProgress(0); }}
      />
      <button onClick={toggle} className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center flex-shrink-0 text-white">
        {playing ? "⏸" : "▶"}
      </button>
      <div className="flex flex-col gap-1 flex-1">
        <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
          <div className="h-full bg-[#5865f2] rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs" style={{ color: textMuted }}>
          🎤 {duration ? `${Math.floor(duration)}с` : "Голосовое"}
        </span>
      </div>
    </div>
  );
}

export default function Index() {
  const [servers, setServers] = useState<ServerItem[]>(() =>
    loadFromStorage("chat_servers", DEFAULT_SERVERS)
  );
  const [activeServer, setActiveServer] = useState(() =>
    loadFromStorage("chat_activeServer", 1)
  );
  const [activeChannel, setActiveChannel] = useState(() =>
    loadFromStorage("chat_activeChannel", SERVER_CHANNELS[1][0].name)
  );
  const [activeDm, setActiveDm] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [channelMessages, setChannelMessages] = useState<Message[]>(() =>
    loadFromStorage("chat_channelMessages", DEFAULT_CHANNEL_MESSAGES)
  );
  const [dmChats, setDmChats] = useState<DmChats>(() =>
    loadFromStorage("chat_dmChats", {})
  );
  const [typing, setTyping] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [activeTheme, setActiveTheme] = useState(() =>
    loadFromStorage("chat_theme", "light")
  );
  const [activeWallpaper, setActiveWallpaper] = useState<number | null>(() =>
    loadFromStorage("chat_wallpaper", null)
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  // Модалка создания папки/сервера
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderEmoji, setNewFolderEmoji] = useState("📁");

  // Запись голоса
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Сохранение в localStorage при изменениях
  useEffect(() => { saveToStorage("chat_servers", servers); }, [servers]);
  useEffect(() => { saveToStorage("chat_activeServer", activeServer); }, [activeServer]);
  useEffect(() => { saveToStorage("chat_activeChannel", activeChannel); }, [activeChannel]);
  useEffect(() => { saveToStorage("chat_theme", activeTheme); }, [activeTheme]);
  useEffect(() => { saveToStorage("chat_wallpaper", activeWallpaper); }, [activeWallpaper]);
  useEffect(() => { saveToStorage("chat_channelMessages", channelMessages); }, [channelMessages]);
  useEffect(() => { saveToStorage("chat_dmChats", dmChats); }, [dmChats]);

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
      setDmChats(prev => ({ ...prev, [name]: [{ id: 1, author: name, avatar: member.avatar, color: member.color, time: getTime(), text: DM_GREETINGS[name] || "Привет!", isVoice: false }] }));
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim(); setInputValue("");
    if (activeDm) {
      const member = allMembers.find(m => m.name === activeDm)!;
      const myMsg: Message = { id: Date.now(), author: "Пользователь", avatar: "Я", color: "#5865f2", time: getTime(), text, isVoice: false };
      setDmChats(prev => ({ ...prev, [activeDm]: [...(prev[activeDm] || []), myMsg] }));
      setTyping(true);
      setTimeout(() => {
        const replies = ["Интересно! Расскажи подробнее 🙂", "Понял тебя, хорошая мысль!", "Ага, согласен 👍", "Хм, надо подумать...", "Отлично!", "Окей 😊", "Да, именно так!", "Не совсем понял, объясни?"];
        const reply: Message = { id: Date.now() + 1, author: activeDm, avatar: member.avatar, color: member.color, time: getTime(), text: replies[Math.floor(Math.random() * replies.length)], isVoice: false };
        setDmChats(prev => ({ ...prev, [activeDm]: [...(prev[activeDm] || []), reply] }));
        setTyping(false);
      }, 1000 + Math.random() * 1000);
    } else {
      setChannelMessages(prev => [...prev, { id: Date.now(), author: "Пользователь", avatar: "Я", color: "#5865f2", time: getTime(), text, isVoice: false }]);
    }
  };

  // Создание новой папки/сервера
  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    const newId = Date.now();
    const newServer: ServerItem = {
      id: newId,
      label: newFolderEmoji,
      name: newFolderName.trim(),
      isCustom: true,
    };
    setServers(prev => [...prev, newServer]);
    // Добавляем каналы для нового сервера
    SERVER_CHANNELS[newId] = [{ name: "общий", unread: false }];
    setNewFolderName("");
    setNewFolderEmoji("📁");
    setShowAddModal(false);
  };

  // Запись голоса
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch {
      alert("Нет доступа к микрофону");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(blob);
      const voiceMsg: Message = {
        id: Date.now(),
        author: "Пользователь",
        avatar: "Я",
        color: "#5865f2",
        time: getTime(),
        text: "",
        isVoice: true,
        audioUrl,
      };
      if (activeDm) {
        setDmChats(prev => ({ ...prev, [activeDm!]: [...(prev[activeDm!] || []), voiceMsg] }));
      } else {
        setChannelMessages(prev => [...prev, voiceMsg]);
      }
      mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    };
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setRecordingSeconds(0);
  };

  const currentMessages = activeDm ? (dmChats[activeDm] || []) : channelMessages;
  const currentMember = activeDm ? allMembers.find(m => m.name === activeDm) : null;

  const isGaming = activeServer === 2;
  const isArt = activeServer === 3;
  const isMusic = activeServer === 5;
  const isCustomServer = servers.find(s => s.id === activeServer)?.isCustom ?? false;
  const isSpecial = (isGaming || isArt || isMusic) && !isCustomServer;

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

      {/* Модалка создания папки */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="rounded-2xl p-6 w-80 shadow-2xl" style={{ background: headerBg }} onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4" style={{ color: textMain }}>Новая папка</h2>
            <div className="mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={{ color: textMuted }}>Значок</label>
              <div className="flex flex-wrap gap-2">
                {FOLDER_EMOJIS.map(emoji => (
                  <button key={emoji}
                    onClick={() => setNewFolderEmoji(emoji)}
                    className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all"
                    style={{ background: newFolderEmoji === emoji ? "#5865f2" : inputBg, transform: newFolderEmoji === emoji ? "scale(1.1)" : "scale(1)" }}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={{ color: textMuted }}>Название папки</label>
              <input
                autoFocus
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: inputBg, color: textMain }}
                placeholder="Например: Работа, Друзья..."
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddFolder()}
                maxLength={30}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-black/10"
                style={{ color: textMuted }}>
                Отмена
              </button>
              <button onClick={handleAddFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-40"
                style={{ background: "#5865f2" }}>
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Сайдбар серверов */}
      <div className="w-[72px] flex flex-col items-center py-3 gap-2 flex-shrink-0 z-20 overflow-y-auto" style={{ background: sidebarBg }}>
        {servers.map((s) => (
          <button key={s.id}
            onClick={() => {
              setActiveServer(s.id);
              setActiveDm(null);
              const channels = SERVER_CHANNELS[s.id];
              setActiveChannel(channels ? channels[0].name : "общий");
            }}
            className={`w-12 h-12 flex items-center justify-center text-xl transition-all duration-200 relative flex-shrink-0
              ${s.id === activeServer ? "bg-[#5865f2] rounded-2xl" : "bg-white/80 rounded-3xl hover:rounded-2xl hover:bg-[#5865f2]"}`}
          >
            {s.id === activeServer && <div className="absolute left-0 w-1 h-8 bg-black/30 rounded-r-full -translate-x-[4px]" />}
            {s.label}
          </button>
        ))}
        <div className="w-8 h-px bg-black/10 my-1 flex-shrink-0" />
        <button
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 bg-white/80 rounded-3xl hover:rounded-2xl hover:bg-[#23a55a] flex items-center justify-center transition-all duration-200 text-[#23a55a] hover:text-white text-xl font-bold flex-shrink-0">
          +
        </button>
      </div>

      {/* Сайдбар каналов */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 absolute md:relative z-10 w-60 flex flex-col h-full transition-transform duration-200`}
        style={{ background: sidebarBg }}>
        <div className="px-4 py-3 border-b border-black/10 flex items-center justify-between shadow-sm">
          <h2 className="font-bold text-base truncate" style={{ color: textMain }}>{servers.find(s => s.id === activeServer)?.name}</h2>
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
            {(SERVER_CHANNELS[activeServer] || [{ name: "общий", unread: false }]).map((ch) => (
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
            <div className="w-8 h-8 flex items-center justify-center bg-red-600 rounded-full"><span className="text-white text-sm font-semibold">Я</span></div>
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
              <div className="flex-1 overflow-y-auto p-4">
                <GamingHub headerBg={headerBg} textMain={textMain} textMuted={textMuted} />
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
            {(!isSpecial || activeDm) && (
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                <div className="mb-6 pb-4 border-b border-black/10">
                  {activeDm && currentMember ? (
                    <>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3" style={{ background: currentMember.color }}>{currentMember.avatar}</div>
                      <h2 className="text-2xl font-bold mb-1" style={{ color: textMain }}>{activeDm}</h2>
                      <p className="text-sm" style={{ color: textMuted }}>Начало вашей переписки с {activeDm}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 text-3xl" style={{ background: inputBg }}>
                        <Icon name="Hash" size={32} style={{ color: textMuted }} />
                      </div>
                      <h2 className="text-2xl font-bold mb-1" style={{ color: textMain }}>Добро пожаловать в #{activeChannel}!</h2>
                      <p className="text-sm" style={{ color: textMuted }}>Это начало канала #{activeChannel}.</p>
                    </>
                  )}
                </div>
                {currentMessages.map((msg, i) => {
                  const prev = currentMessages[i - 1];
                  const isGrouped = prev && prev.author === msg.author && !msg.isVoice && !prev.isVoice;
                  return (
                    <div key={msg.id}
                      className={`flex gap-3 px-2 py-0.5 rounded-lg group transition-colors ${isGrouped ? "mt-0" : "mt-3"}`}
                      onMouseEnter={e => (e.currentTarget.style.background = msgHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      {!isGrouped ? (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm" style={{ background: msg.color }}>{msg.avatar}</div>
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
                        {msg.isVoice && msg.audioUrl ? (
                          <VoiceMessagePlayer audioUrl={msg.audioUrl} textMuted={textMuted} inputBg={inputBg} />
                        ) : (
                          <p className="text-sm leading-relaxed" style={{ color: activeTheme === "dark" ? "#dbdee1" : textMain }}>{msg.text}</p>
                        )}
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
                {isRecording && (
                  <div className="flex items-center gap-3 rounded-lg px-4 py-2 mb-2" style={{ background: "#ed424522" }}>
                    <span className="w-2 h-2 rounded-full bg-[#ed4245] animate-pulse" />
                    <span className="text-sm font-medium text-[#ed4245]">Запись... {recordingSeconds}с</span>
                    <button onClick={stopRecording}
                      className="ml-auto text-xs font-semibold text-white px-3 py-1 rounded-full bg-[#ed4245]">
                      Стоп
                    </button>
                  </div>
                )}
                <div className="rounded-lg flex items-center gap-2 px-4 py-3" style={{ background: inputBg }}>
                  <button className="flex-shrink-0 transition-colors" style={{ color: textMuted }}><Icon name="Plus" size={20} /></button>
                  <input className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: textMain }}
                    placeholder={activeDm ? `Написать ${activeDm}` : `Написать в #${activeChannel}`}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()} />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      onTouchStart={startRecording}
                      onTouchEnd={stopRecording}
                      title="Удерживай для записи голоса"
                      style={{ color: isRecording ? "#ed4245" : textMuted }}
                      className="transition-colors">
                      <Icon name="Mic" size={20} />
                    </button>
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