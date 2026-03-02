import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Send, Smile, Users, MoreVertical, Phone, Video, 
  Pin, Search, Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👏', '🚀', '💡'];

const Chat: React.FC = () => {
  const { getCurrentGroup, getUserById, messages, sendMessage, addReaction, currentUser, loadGroupMessages } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const group = getCurrentGroup();

  // Load messages from API when group changes
  useEffect(() => {
    if (group?.id) {
      loadGroupMessages(group.id);
    }
  }, [group?.id, loadGroupMessages]);

  const groupMessages = messages
    .filter(m => m.groupId === group?.id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const totalMembers = group?.memberCount || 0;
  const onlineUsers = group?.onlineCount || 0;

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      // Find the ScrollArea's viewport (parent of the content container)
      const viewport = messagesContainerRef.current.parentElement?.parentElement;
      if (viewport) {
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight;
        }, 0);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages]);

  const handleSend = () => {
    if (!newMessage.trim() || !group) return;
    sendMessage(group.id, newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredMessages = searchQuery
    ? groupMessages.filter(m => 
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : groupMessages;

  if (!group) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No group assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in">
      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col border-border/50 shadow-soft">
        {/* Chat Header */}
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {onlineUsers} online • {totalMembers} members
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Phone className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><Pin className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-4" ref={messagesContainerRef}>
              {filteredMessages.map((message, idx) => {
                const sender = getUserById(message.senderId);
                const isOwn = message.senderId === currentUser?.id;
                const showAvatar = idx === 0 || 
                  filteredMessages[idx - 1].senderId !== message.senderId;

                return (
                  <div 
                    key={message.id}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    {showAvatar ? (
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={sender?.avatar} alt={sender?.name} />
                        <AvatarFallback>{sender?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10" />
                    )}
                    <div className={`max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
                      {showAvatar && (
                        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
                          <span className="text-sm font-medium text-foreground">
                            {isOwn ? 'You' : sender?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.timestamp), 'h:mm a')}
                          </span>
                        </div>
                      )}
                      <div 
                        className={`p-3 rounded-2xl ${
                          isOwn 
                            ? 'bg-gradient-primary text-primary-foreground rounded-br-sm' 
                            : 'bg-muted text-foreground rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>

                      {message.reactions.length > 0 && (
                        <div className={`flex gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                          {message.reactions.map((reaction, rIdx) => (
                            <button
                              key={rIdx}
                              onClick={() => addReaction(message.id, reaction.emoji)}
                              className="px-2 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors flex items-center gap-1"
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-muted-foreground">{reaction.users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <Popover>
                        <PopoverTrigger asChild>
                          <button className={`mt-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity ${isOwn ? 'ml-auto' : ''}`}>
                            <Smile className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align={isOwn ? 'end' : 'start'}>
                          <div className="flex gap-1">
                            {EMOJI_LIST.map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(message.id, emoji)}
                                className="w-8 h-8 hover:bg-muted rounded transition-colors text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Message Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon"><ImageIcon className="w-5 h-5" /></Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon"><Smile className="w-5 h-5" /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="grid grid-cols-5 gap-1">
                  {EMOJI_LIST.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewMessage(prev => prev + emoji)}
                      className="w-8 h-8 hover:bg-muted rounded transition-colors text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="bg-gradient-primary text-primary-foreground shadow-glow"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Members Sidebar */}
      <Card className="w-72 border-border/50 shadow-soft hidden lg:block">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Online — {onlineUsers}
            </p>
            <p className="text-sm text-muted-foreground">Members are displayed here when real-time data is available.</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Offline — {totalMembers - onlineUsers}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
