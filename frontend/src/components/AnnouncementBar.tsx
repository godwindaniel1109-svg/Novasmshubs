import React, { useState, useEffect } from 'react';
import { X, Info, CheckCircle, AlertCircle, XCircle, Bell } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: string;
}

interface AnnouncementBarProps {
  onAnnouncementRead?: (announcementId: string) => void;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onAnnouncementRead }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAnnouncements();
    
    // Check for new announcements every 30 seconds
    const interval = setInterval(loadAnnouncements, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (announcements.length > 0 && !currentAnnouncement) {
      showNextAnnouncement();
    }
  }, [announcements]);

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/announcements/active');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showNextAnnouncement = () => {
    const unreadAnnouncements = announcements.filter(a => a.isActive);
    if (unreadAnnouncements.length > 0) {
      // Show highest priority announcement first
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const sortedAnnouncements = unreadAnnouncements.sort((a, b) => 
        priorityOrder[b.priority] - priorityOrder[a.priority]
      );
      
      setCurrentAnnouncement(sortedAnnouncements[0]);
      setIsVisible(true);
      
      // Auto-hide after 10 seconds for low/medium priority, 15 seconds for high priority
      const hideDelay = sortedAnnouncements[0].priority === 'high' ? 15000 : 10000;
      setTimeout(() => {
        hideAnnouncement(sortedAnnouncements[0].id);
      }, hideDelay);
    }
  };

  const hideAnnouncement = (announcementId?: string) => {
    if (announcementId && onAnnouncementRead) {
      onAnnouncementRead(announcementId);
    }
    setIsVisible(false);
    setTimeout(() => {
      setCurrentAnnouncement(null);
      // Remove the shown announcement from the list
      if (announcementId) {
        setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
      }
      // Show next announcement if available
      setTimeout(showNextAnnouncement, 1000);
    }, 300);
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAnnouncementStyles = (type: string, priority: string) => {
    const baseStyles = "fixed top-0 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out";
    
    const typeStyles = {
      info: "bg-blue-50 border-blue-200 text-blue-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800"
    };

    const priorityStyles = {
      low: "shadow-sm",
      medium: "shadow-md",
      high: "shadow-lg border-2"
    };

    return `${baseStyles} ${typeStyles[type as keyof typeof typeStyles]} ${priorityStyles[priority as keyof typeof priorityStyles]} border-b`;
  };

  if (!currentAnnouncement || !isVisible) {
    return null;
  }

  return (
    <div className={getAnnouncementStyles(currentAnnouncement.type, currentAnnouncement.priority)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex-shrink-0 mr-3">
              {getAnnouncementIcon(currentAnnouncement.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <p className="text-sm font-medium truncate">
                  {currentAnnouncement.title}
                </p>
                {currentAnnouncement.priority === 'high' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Important
                  </span>
                )}
              </div>
              <p className="text-sm mt-1 truncate">
                {currentAnnouncement.message}
              </p>
            </div>
          </div>
          
          <div className="flex items-center ml-4 space-x-2">
            <button
              onClick={() => hideAnnouncement(currentAnnouncement.id)}
              className="flex-shrink-0 p-1 rounded-md hover:bg-opacity-20 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar for auto-hide */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-300 bg-opacity-30">
        <div 
          className="h-full bg-current bg-opacity-50"
          style={{
            animation: 'shrink 10s linear forwards',
            animationDuration: currentAnnouncement.priority === 'high' ? '15s' : '10s'
          }}
        />
      </div>
      
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBar;
