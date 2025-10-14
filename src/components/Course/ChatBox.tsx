import { useCallback, useEffect, useRef, useState } from "react";
import { get, post } from "../../services/http.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useLoader } from "../../contexts/LoaderContext.tsx";
import * as React from "react";
import { useToast } from "../../contexts/ToastContext.tsx";
import InfiniteScroll from "react-infinite-scroll-component";

type MessageType = {
  id: number;
  user: {
    email: string;
  };
  text: string;
  date: string;
};

type ChatBoxProps = {
  courseId: number;
  messages?: MessageType[];
};

type ChatBubbleProps = {
  isMe: boolean;
  message: MessageType;
};

const LIMIT = 20;

const ChatBox = ({ courseId }: ChatBoxProps) => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const scrollableRef = useRef<HTMLDivElement>(null);

  const fetchJwt = useCallback(async () => {
    setLoading(true);
    try {
      await get(`${import.meta.env.VITE_API_URL}/chat/subscribe-jwt`);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const fetchInitialMessages = useCallback(async () => {
    setLoading(true);

    try {
      const res = await get(
        `${import.meta.env.VITE_API_URL}/message/course/${courseId}?limit=${LIMIT}`,
      );

      if (!res.isError) {
        setMessages(res.data);
      }
    } finally {
      setLoading(false);
    }
  }, [courseId, setLoading]);

  const fetchMessages = async (beforeId?: number) => {
    let url = `${import.meta.env.VITE_API_URL}/message/course/${courseId}?limit=${LIMIT}`;
    if (beforeId) url += `&beforeId=${beforeId}`;
    const res = await get(url);
    return res.data as MessageType[];
  };

  const fetchOlderMessages = async () => {
    const scrollDiv = scrollableRef.current;
    if (!scrollDiv || messages.length === 0 || loadingMore) return;

    const oldScrollTop = scrollDiv.scrollTop;

    setLoadingMore(true);
    try {
      const oldestId = messages[messages.length - 1].id;
      const olderMessages = await fetchMessages(oldestId);
      setMessages((prev) => [...prev, ...olderMessages]);
      setHasMore(olderMessages.length === LIMIT);
    } finally {
      setLoadingMore(false);
    }
    requestAnimationFrame(() => {
      scrollDiv.scrollTop = oldScrollTop;

      if (Math.abs(scrollDiv.scrollTop) < 100) {
        scrollDiv.scrollTop = 0;
      }
    });
  };

  const isMyMessage = (message: MessageType) => {
    return message.user.email === user?.email;
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await post(
      `${import.meta.env.VITE_API_URL}/chat/send/${courseId}`,
      {
        message: message,
      },
    );

    if (!res.isError) {
      setMessage("");
      showToast("message sent", "success");
    } else {
      showToast(res.message, "error");
    }
  };

  useEffect(() => {
    fetchJwt();
    fetchInitialMessages();

    const url = new URL(import.meta.env.VITE_MERCURE_PUBLIC_URL.toString());
    url.searchParams.append(
      "topic",
      `http://localhost/course/${courseId}/chat`,
    );

    const eventSource = new EventSource(url.toString(), {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      const outer = JSON.parse(event.data);
      const parsed: MessageType = JSON.parse(outer.message);
      setMessages((prev) => [parsed, ...prev]);
    };

    eventSource.onerror = async () => {
      fetchJwt();
    };

    return () => {
      eventSource.close();
    };
  }, [courseId, fetchJwt, fetchInitialMessages]);

  const ChatBubble = ({ isMe, message }: ChatBubbleProps) => {
    return (
      <div className={`chat ${isMe ? "chat-end" : "chat-start"} my-2`}>
        <div className="chat-header">
          {message.user.email}
          <time className="text-xs opacity-50">{message.date}</time>
        </div>
        <div className="chat-bubble">{message.text}</div>
      </div>
    );
  };

  return (
    <div className={"flex flex-col items-center w-full h-full"}>
      <div
        id="scrollableDiv"
        style={{
          height: "70vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
        }}
        className={"card bg-base-100 shadow-sm w-[70%] "}
        ref={scrollableRef}
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchOlderMessages}
          hasMore={hasMore}
          inverse={true}
          loader={<p>Loading...</p>}
          endMessage={<p>No more messages to load.</p>}
          scrollableTarget="scrollableDiv"
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          {messages.map((item) => (
            <ChatBubble key={item.id} isMe={isMyMessage(item)} message={item} />
          ))}
        </InfiniteScroll>
      </div>
      <div className="w-[70%] bg-base-100 shadow-sm mt-2">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type here"
            className="input w-full"
            value={message}
            required={true}
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
