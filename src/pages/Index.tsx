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

const CHANNELS = SERVER_CHANNELS[1];

const VOICE_CHANNELS = ["Голосовой", "Музыка", "AFK"];

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
  "В сети": "#23a55a",
  "Не беспокоить": "#ed4245",
  "Отошёл": "#f0b232",
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

const Index = () => {
  const [activeServer, setActiveServer] = useState(1);
  const [activeChannel, setActiveChannel] = useState(SERVER_CHANNELS[1][0].name);
  const [activeDm, setActiveDm] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [channelMessages, setChannelMessages] = useState(CHANNEL_MESSAGES);
  const [dmChats, setDmChats] = useState<DmChats>({});
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages, dmChats, activeDm]);

  const allMembers = [...MEMBERS_ONLINE, ...MEMBERS_OFFLINE];

  const openDm = (name: string) => {
    setActiveDm(name);
    setSidebarOpen(false);
    if (!dmChats[name]) {
      const member = allMembers.find((m) => m.name === name)!;
      setDmChats((prev) => ({
        ...prev,
        [name]: [
          { id: 1, author: name, avatar: member.avatar, color: member.color, time: getTime(), text: DM_GREETINGS[name] || "Привет!" },
        ],
      }));
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue("");

    if (activeDm) {
      const member = allMembers.find((m) => m.name === activeDm)!;
      const myMsg: Message = { id: Date.now(), author: "Пользователь", avatar: "Я", color: "#5865f2", time: getTime(), text };
      setDmChats((prev) => ({ ...prev, [activeDm]: [...(prev[activeDm] || []), myMsg] }));

      // Имитация ответа
      setTyping(true);
      setTimeout(() => {
        const replies = [
          "Интересно! Расскажи подробнее 🙂",
          "Понял тебя, хорошая мысль!",
          "Ага, согласен 👍",
          "Хм, надо подумать...",
          "Отлично! Буду иметь в виду.",
          "Окей 😊",
          "Да, именно так!",
          "Не совсем понял, объясни?",
        ];
        const reply: Message = {
          id: Date.now() + 1,
          author: activeDm,
          avatar: member.avatar,
          color: member.color,
          time: getTime(),
          text: replies[Math.floor(Math.random() * replies.length)],
        };
        setDmChats((prev) => ({ ...prev, [activeDm]: [...(prev[activeDm] || []), reply] }));
        setTyping(false);
      }, 1000 + Math.random() * 1000);
    } else {
      setChannelMessages((prev) => [
        ...prev,
        { id: Date.now(), author: "Пользователь", avatar: "Я", color: "#5865f2", time: getTime(), text },
      ]);
    }
  };

  const currentMessages = activeDm ? (dmChats[activeDm] || []) : channelMessages;
  const currentTitle = activeDm ?? `#${activeChannel}`;
  const currentMember = activeDm ? allMembers.find((m) => m.name === activeDm) : null;

  return (
    <div className="flex h-screen bg-[#f2f3f5] overflow-hidden font-sans">

      {/* Сайдбар серверов */}
      <div className="w-[72px] bg-[#e3e5e8] flex flex-col items-center py-3 gap-2 flex-shrink-0 z-20">
        {SERVERS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setActiveServer(s.id); setActiveDm(null); setActiveChannel(SERVER_CHANNELS[s.id][0].name); }}
            className={`w-12 h-12 flex items-center justify-center text-xl transition-all duration-200 relative
              ${s.id === activeServer ? "bg-[#5865f2] rounded-2xl" : "bg-white rounded-3xl hover:rounded-2xl hover:bg-[#5865f2]"}`}
          >
            {s.id === activeServer && (
              <div className="absolute left-0 w-1 h-8 bg-[#060607] rounded-r-full -translate-x-[4px]" />
            )}
            {s.label}
          </button>
        ))}
        <div className="w-8 h-px bg-[#c4c9d4] my-1" />
        <button className="w-12 h-12 bg-white rounded-3xl hover:rounded-2xl hover:bg-[#23a55a] flex items-center justify-center transition-all duration-200 text-[#23a55a] hover:text-white text-xl font-bold">
          +
        </button>
      </div>

      {/* Сайдбар каналов */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        absolute md:relative z-10 w-60 bg-[#e3e5e8] flex flex-col h-full transition-transform duration-200`}>

        <div className="px-4 py-3 border-b border-[#c4c9d4] flex items-center justify-between shadow-sm">
          <h2 className="font-bold text-[#060607] text-base truncate">{SERVERS.find(s => s.id === activeServer)?.name}</h2>
          <Icon name="ChevronDown" size={18} className="text-[#4e5058]" />
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          {/* Прямые сообщения */}
          {Object.keys(dmChats).length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 px-2 py-1 text-[#4e5058] text-xs font-semibold uppercase tracking-wider">
                <span>Личные сообщения</span>
              </div>
              {Object.keys(dmChats).map((name) => {
                const m = allMembers.find((x) => x.name === name)!;
                return (
                  <button
                    key={name}
                    onClick={() => { setActiveDm(name); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors
                      ${activeDm === name ? "bg-[#d5d8de] text-[#060607] font-medium" : "text-[#4e5058] hover:bg-[#d5d8de] hover:text-[#313338]"}`}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: m?.color || "#5865f2" }}>
                      {m?.avatar}
                    </div>
                    <span className="truncate">{name}</span>
                  </button>
                );
              })}
              <div className="w-full h-px bg-[#c4c9d4] my-2" />
            </div>
          )}

          {/* Текстовые каналы */}
          <div className="mb-1">
            <div className="flex items-center gap-1 px-2 py-1 text-[#4e5058] text-xs font-semibold uppercase tracking-wider">
              <Icon name="ChevronDown" size={12} />
              <span>Текстовые каналы</span>
            </div>
            {SERVER_CHANNELS[activeServer].map((ch) => (
              <button key={ch.name}
                onClick={() => { setActiveChannel(ch.name); setActiveDm(null); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors
                  ${!activeDm && activeChannel === ch.name ? "bg-[#d5d8de] text-[#060607] font-medium" : "text-[#4e5058] hover:bg-[#d5d8de] hover:text-[#313338]"}`}
              >
                <Icon name="Hash" size={16} />
                <span className="flex-1 text-left">{ch.name}</span>
                {ch.unread && (activeChannel !== ch.name || activeDm) && (
                  <div className="w-2 h-2 bg-[#060607] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Голосовые каналы */}
          <div className="mt-3">
            <div className="flex items-center gap-1 px-2 py-1 text-[#4e5058] text-xs font-semibold uppercase tracking-wider">
              <Icon name="ChevronDown" size={12} />
              <span>Голосовые каналы</span>
            </div>
            {VOICE_CHANNELS.map((ch) => (
              <button key={ch}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-sm text-[#4e5058] hover:bg-[#d5d8de] hover:text-[#313338] cursor-pointer transition-colors">
                <Icon name="Volume2" size={16} />
                <span>{ch}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Панель пользователя */}
        <div className="p-2 bg-[#d5d8de] flex items-center gap-2">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">Я</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#23a55a] border-2 border-[#d5d8de] rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[#060607] text-sm font-semibold truncate">Пользователь</div>
            <div className="text-[#4e5058] text-xs">В сети</div>
          </div>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#c4c9d4] text-[#4e5058] transition-colors">
              <Icon name="Mic" size={15} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#c4c9d4] text-[#4e5058] transition-colors">
              <Icon name="Settings" size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Основная область */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Шапка */}
        <div className="h-12 bg-white border-b border-[#e3e5e8] flex items-center px-4 gap-3 flex-shrink-0 shadow-sm">
          <button className="md:hidden text-[#4e5058] mr-1" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Icon name="Menu" size={20} />
          </button>
          {activeDm && currentMember ? (
            <>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: currentMember.color }}>
                {currentMember.avatar}
              </div>
              <span className="font-bold text-[#060607]">{activeDm}</span>
              <div className="w-px h-5 bg-[#e3e5e8] mx-1 hidden sm:block" />
              <span className="text-[#4e5058] text-sm hidden sm:block">{(MEMBERS_ONLINE.find(m => m.name === activeDm))?.status ?? "Не в сети"}</span>
            </>
          ) : (
            <>
              <Icon name="Hash" size={20} className="text-[#4e5058]" />
              <span className="font-bold text-[#060607]">{activeChannel}</span>
              <div className="w-px h-5 bg-[#e3e5e8] mx-1 hidden sm:block" />
              <span className="text-[#4e5058] text-sm hidden sm:block">Добро пожаловать!</span>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            <button className="text-[#4e5058] hover:text-[#313338] transition-colors">
              <Icon name="Users" size={20} />
            </button>
            <div className="relative hidden md:block">
              <Icon name="Search" size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4e5058]" />
              <input className="bg-[#f2f3f5] border border-[#e3e5e8] rounded pl-8 pr-3 py-1 text-sm text-[#313338] placeholder:text-[#4e5058] outline-none focus:border-[#5865f2] w-36"
                placeholder="Поиск" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Сообщения */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">

              {/* Начало чата */}
              <div className="mb-6 pb-4 border-b border-[#e3e5e8]">
                {activeDm && currentMember ? (
                  <>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3"
                      style={{ background: currentMember.color }}>
                      {currentMember.avatar}
                    </div>
                    <h2 className="text-2xl font-bold text-[#060607] mb-1">{activeDm}</h2>
                    <p className="text-[#4e5058] text-sm">Это начало вашего личного разговора с <strong>{activeDm}</strong>.</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-[#e3e5e8] rounded-full flex items-center justify-center mb-3">
                      <Icon name="Hash" size={24} className="text-[#4e5058]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#060607] mb-1">Добро пожаловать в #{activeChannel}!</h2>
                    <p className="text-[#4e5058] text-sm">Это начало канала #{activeChannel}.</p>
                  </>
                )}
              </div>

              {currentMessages.map((msg, i) => {
                const isGrouped = i > 0 && currentMessages[i - 1].author === msg.author;
                return (
                  <div key={msg.id}
                    className={`flex gap-3 group hover:bg-[#e9eaec] rounded px-2 py-0.5 transition-colors ${isGrouped ? "" : "mt-4"}`}>
                    {!isGrouped ? (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-semibold text-sm"
                        style={{ background: msg.color }}>
                        {msg.avatar}
                      </div>
                    ) : (
                      <div className="w-10 flex-shrink-0 flex items-center justify-end">
                        <span className="text-[#a3a6aa] text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                          {msg.time.split(" ").slice(-2).join(" ")}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {!isGrouped && (
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-semibold text-[#060607] text-sm">{msg.author}</span>
                          <span className="text-[#a3a6aa] text-xs">{msg.time}</span>
                        </div>
                      )}
                      <p className="text-[#313338] text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                );
              })}

              {/* Индикатор печати */}
              {typing && activeDm && (
                <div className="flex gap-3 px-2 py-1 mt-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
                    style={{ background: currentMember?.color }}>
                    {currentMember?.avatar}
                  </div>
                  <div className="flex items-center gap-1 bg-[#e3e5e8] rounded-full px-4 py-2">
                    <span className="w-2 h-2 bg-[#4e5058] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[#4e5058] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[#4e5058] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Поле ввода */}
            <div className="px-4 pb-4 flex-shrink-0">
              <div className="bg-[#e9eaec] rounded-lg flex items-center gap-2 px-4 py-3">
                <button className="text-[#4e5058] hover:text-[#313338] transition-colors flex-shrink-0">
                  <Icon name="Plus" size={20} />
                </button>
                <input
                  className="flex-1 bg-transparent text-[#313338] placeholder:text-[#4e5058] text-sm outline-none"
                  placeholder={activeDm ? `Написать ${activeDm}` : `Написать в #${activeChannel}`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="text-[#4e5058] hover:text-[#313338] transition-colors">
                    <Icon name="Smile" size={20} />
                  </button>
                  <button onClick={sendMessage}
                    className={`transition-colors ${inputValue ? "text-[#5865f2]" : "text-[#4e5058]"}`}>
                    <Icon name="Send" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Панель участников */}
          <div className="hidden lg:flex w-60 bg-[#f2f3f5] flex-col flex-shrink-0 overflow-y-auto px-3 py-4 border-l border-[#e3e5e8]">
            <h3 className="text-[#4e5058] text-xs font-semibold uppercase tracking-wider mb-2 px-2">
              В сети — {MEMBERS_ONLINE.length}
            </h3>
            {MEMBERS_ONLINE.map((m) => (
              <button key={m.name} onClick={() => openDm(m.name)}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#e3e5e8] transition-colors group">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ background: m.color }}>
                    {m.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-[#f2f3f5] rounded-full"
                    style={{ background: STATUS_COLORS[m.status] || "#4e5058" }} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[#313338] text-sm font-medium truncate group-hover:text-[#5865f2] transition-colors">{m.name}</div>
                  <div className="text-[#4e5058] text-xs truncate">{m.status}</div>
                </div>
                <Icon name="MessageSquare" size={14} className="text-[#4e5058] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}

            <h3 className="text-[#4e5058] text-xs font-semibold uppercase tracking-wider mb-2 px-2 mt-4">
              Не в сети — {MEMBERS_OFFLINE.length}
            </h3>
            {MEMBERS_OFFLINE.map((m) => (
              <button key={m.name} onClick={() => openDm(m.name)}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#e3e5e8] transition-colors opacity-50 hover:opacity-80 group">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#4e5058] flex items-center justify-center text-white text-sm font-semibold">
                    {m.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#80848e] border-2 border-[#f2f3f5] rounded-full" />
                </div>
                <div className="text-[#4e5058] text-sm font-medium truncate">{m.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;