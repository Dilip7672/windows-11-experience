import React, { useState } from 'react';
import { X, Mail, Github, Linkedin, MapPin, Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen && !isClosing) return null;

  const userInfo = {
    name: "Dilip Poudel",
    title: "Data Scientist | ML Engineer",
    location: "Nepal",
    email: "dilippoudel@example.com",
    github: "github.com/dilippoudel",
    linkedin: "linkedin.com/in/dilippoudel",
    bio: "Passionate data scientist specializing in machine learning, deep learning, and data analysis. I love transforming complex data into actionable insights and building intelligent systems.",
    skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Data Analysis", "SQL", "React", "TypeScript"],
    education: "B.S. Computer Science",
    experience: "3+ Years in Data Science"
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-[2000]",
          isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
        )}
        onClick={handleClose}
      />
      
      {/* Profile Card */}
      <div 
        className={cn(
          "fixed left-1/2 -translate-x-1/2 z-[2001] w-[90%] max-w-[450px] top-4 sm:top-1/2 sm:-translate-y-1/2 max-h-[90vh] overflow-y-auto",
          isClosing ? "animate-window-close" : "animate-window-open"
        )}
      >
        <div className="glass rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="relative h-24 bg-gradient-to-r from-primary via-primary/80 to-accent">
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Avatar */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-4 ring-background shadow-xl">
                <span className="text-3xl">👨‍💻</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-14 pb-6 px-6">
            {/* Name & Title */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">{userInfo.name}</h2>
              <p className="text-sm text-muted-foreground">{userInfo.title}</p>
              <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{userInfo.location}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <Briefcase className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="text-xs font-medium">{userInfo.experience}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <GraduationCap className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="text-xs font-medium">{userInfo.education}</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-center">
              {userInfo.bio}
            </p>

            {/* Skills */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                <Award className="w-3 h-3" /> Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {userInfo.skills.map((skill, index) => (
                  <span 
                    key={skill}
                    className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full animate-list-item"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Links */}
            <div className="space-y-2">
              <a 
                href={`mailto:${userInfo.email}`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-sm flex-1">{userInfo.email}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <a 
                href={`https://${userInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-sm flex-1">{userInfo.github}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <a 
                href={`https://${userInfo.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-sm flex-1">{userInfo.linkedin}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
