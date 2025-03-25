
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Send, User, Clock } from 'lucide-react';

// Интерфейс для сообщения
interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
  content: string;
  timestamp: Date;
}

// Интерфейс для контакта (для списка чатов)
interface Contact {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  lastMessage?: string;
  unread?: number;
}

const Chat = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [activeContact, setActiveContact] = useState<string | null>(null);
  
  // Демо-данные для контактов
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'c1', name: 'Елена Петрова', role: 'teacher', lastMessage: 'Добрый день! Когда будет следующая лекция?', unread: 2 },
    { id: 'c2', name: 'Иван Сидоров', role: 'student', lastMessage: 'Спасибо за информацию', unread: 0 },
    { id: 'c3', name: 'Мария Иванова', role: 'student', lastMessage: 'Отправил вам задание', unread: 1 },
    { id: 'c4', name: 'Александр Николаев', role: 'teacher', lastMessage: 'Консультация в четверг', unread: 0 },
  ]);

  // Демо-данные для сообщений
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    c1: [
      { 
        id: 'm1', 
        sender: { id: 'c1', name: 'Елена Петрова', role: 'teacher' }, 
        content: 'Добрый день! Когда будет следующая лекция?', 
        timestamp: new Date('2023-05-15T10:30:00') 
      },
      { 
        id: 'm2', 
        sender: { id: 'user', name: user?.name || 'Вы', role: user?.role || 'student' }, 
        content: 'Здравствуйте! Лекция будет в пятницу в 10:00.', 
        timestamp: new Date('2023-05-15T10:35:00') 
      },
      { 
        id: 'm3', 
        sender: { id: 'c1', name: 'Елена Петрова', role: 'teacher' }, 
        content: 'Спасибо за информацию! А будут ли какие-то материалы доступны заранее?', 
        timestamp: new Date('2023-05-15T10:40:00') 
      }
    ],
    c2: [
      { 
        id: 'm4', 
        sender: { id: 'user', name: user?.name || 'Вы', role: user?.role || 'student' }, 
        content: 'Добрый день, проверьте пожалуйста мою курсовую работу, когда у вас будет время.', 
        timestamp: new Date('2023-05-14T15:20:00') 
      },
      { 
        id: 'm5', 
        sender: { id: 'c2', name: 'Иван Сидоров', role: 'student' }, 
        content: 'Спасибо за информацию', 
        timestamp: new Date('2023-05-14T15:25:00') 
      }
    ],
    c3: [
      { 
        id: 'm6', 
        sender: { id: 'c3', name: 'Мария Иванова', role: 'student' }, 
        content: 'Отправил вам задание', 
        timestamp: new Date('2023-05-13T09:10:00') 
      }
    ],
    c4: [
      { 
        id: 'm7', 
        sender: { id: 'c4', name: 'Александр Николаев', role: 'teacher' }, 
        content: 'Консультация в четверг', 
        timestamp: new Date('2023-05-12T14:15:00') 
      }
    ]
  });

  useEffect(() => {
    // Проверка авторизации
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Выбор первого контакта по умолчанию, если ни один не выбран
    if (!activeContact && contacts.length > 0) {
      setActiveContact(contacts[0].id);
    }
  }, [isAuthenticated, navigate, activeContact, contacts]);

  // Форматирование даты
  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (today.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) + ' ' + 
             messageDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Отправка сообщения
  const handleSendMessage = () => {
    if (message.trim() && activeContact) {
      const newMessage: Message = {
        id: `m${Date.now()}`,
        sender: { id: 'user', name: user?.name || 'Вы', role: user?.role || 'student' },
        content: message,
        timestamp: new Date()
      };
      
      // Добавление сообщения в текущий чат
      setMessages(prev => ({
        ...prev,
        [activeContact]: [...(prev[activeContact] || []), newMessage]
      }));
      
      // Обновление последнего сообщения в списке контактов
      setContacts(prev => 
        prev.map(contact => 
          contact.id === activeContact 
            ? { ...contact, lastMessage: message.slice(0, 30) + (message.length > 30 ? '...' : ''), unread: 0 }
            : contact
        )
      );
      
      // Очистка поля ввода
      setMessage('');
    }
  };

  // Обработка Enter для отправки сообщения
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Обработка клика по контакту
  const handleContactClick = (contactId: string) => {
    setActiveContact(contactId);
    
    // Сбрасываем счетчик непрочитанных сообщений
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, unread: 0 }
          : contact
      )
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-4">Сообщения</h1>
        <p className="text-muted-foreground mb-6">
          Общайтесь с преподавателями и студентами в режиме реального времени
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-300px)] min-h-[500px]">
        {/* Список контактов */}
        <AnimatedCard className="md:col-span-1 h-full overflow-hidden">
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold p-4 border-b">Чаты</h2>
            <div className="overflow-y-auto flex-grow">
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  className={`flex items-center p-4 cursor-pointer hover:bg-accent/50 transition-colors ${
                    activeContact === contact.id ? 'bg-accent' : ''
                  } ${contact.unread ? 'font-medium' : ''}`}
                  onClick={() => handleContactClick(contact.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{contact.name}</p>
                      {contact.unread > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.lastMessage || 'Нет сообщений'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>
        
        {/* Окно чата */}
        <AnimatedCard delay={1} className="md:col-span-3 flex flex-col h-full">
          {activeContact ? (
            <>
              {/* Заголовок чата */}
              <div className="p-4 border-b flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{contacts.find(c => c.id === activeContact)?.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {contacts.find(c => c.id === activeContact)?.role === 'teacher' ? 'Преподаватель' : 'Студент'}
                  </p>
                </div>
              </div>
              
              {/* Сообщения */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages[activeContact]?.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender.id === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] ${
                        msg.sender.id === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      } p-3 rounded-lg`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {msg.sender.id === 'user' ? 'Вы' : msg.sender.name}
                        </span>
                        <span className="text-xs flex items-center ml-2">
                          <Clock className="h-3 w-3 inline mr-1" /> 
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Форма отправки сообщения */}
              <div className="p-4 border-t">
                <div className="flex items-end">
                  <Textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Введите сообщение..."
                    className="flex-grow resize-none min-h-[80px]"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()} 
                    size="icon" 
                    className="ml-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Card className="max-w-md p-6 text-center">
                <p className="text-muted-foreground">Выберите чат, чтобы начать общение</p>
              </Card>
            </div>
          )}
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Chat;
