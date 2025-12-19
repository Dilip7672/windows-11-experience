import React from 'react';
import { FileText, Download, ZoomIn, ZoomOut, Printer } from 'lucide-react';

interface PDFViewerProps {
  fileName?: string;
}

export function PDFViewer({ fileName = "portfolio.pdf" }: PDFViewerProps) {
  return (
    <div className="flex flex-col h-full bg-[hsl(var(--secondary))]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-background/50">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium">{fileName}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs px-2">100%</span>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Printer className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto bg-background rounded-lg shadow-lg p-8 space-y-6 animate-fade-in">
          {/* Header */}
          <div className="text-center border-b border-border/50 pb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              John Doe
            </h1>
            <p className="text-lg text-muted-foreground mt-2">Full Stack Developer</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>📧 john.doe@email.com</span>
              <span>📱 +1 (555) 123-4567</span>
              <span>📍 New York, NY</span>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm">
              <a href="#" className="text-primary hover:underline">🔗 linkedin.com/in/johndoe</a>
              <a href="#" className="text-primary hover:underline">🐙 github.com/johndoe</a>
              <a href="#" className="text-primary hover:underline">🌐 johndoe.dev</a>
            </div>
          </div>

          {/* Summary */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Professional Summary
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Passionate Full Stack Developer with 5+ years of experience building scalable web applications. 
              Proficient in React, Node.js, TypeScript, and cloud technologies. Strong problem-solving skills 
              with a focus on creating user-friendly, performant solutions. Open source contributor and 
              continuous learner committed to staying current with emerging technologies.
            </p>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Technical Skills
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm mb-2">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'GraphQL'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">Cloud & DevOps</h3>
                <div className="flex flex-wrap gap-2">
                  {['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Vercel'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {['Git', 'VS Code', 'Figma', 'Jira', 'Postman'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Work Experience
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-primary/30 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">Senior Full Stack Developer</h3>
                    <p className="text-primary text-sm">TechCorp Inc.</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2022 - Present</span>
                </div>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>• Led development of microservices architecture serving 1M+ users</li>
                  <li>• Reduced load times by 40% through performance optimizations</li>
                  <li>• Mentored team of 5 junior developers</li>
                </ul>
              </div>
              <div className="border-l-2 border-primary/30 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">Full Stack Developer</h3>
                    <p className="text-primary text-sm">StartupXYZ</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2020 - 2022</span>
                </div>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>• Built e-commerce platform from scratch using React and Node.js</li>
                  <li>• Implemented real-time features using WebSockets</li>
                  <li>• Integrated payment gateways (Stripe, PayPal)</li>
                </ul>
              </div>
              <div className="border-l-2 border-primary/30 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">Frontend Developer</h3>
                    <p className="text-primary text-sm">DigitalAgency Co.</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2019 - 2020</span>
                </div>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>• Developed responsive web applications for 20+ clients</li>
                  <li>• Improved accessibility compliance to WCAG 2.1 standards</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Education
            </h2>
            <div className="border-l-2 border-primary/30 pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Bachelor of Science in Computer Science</h3>
                  <p className="text-primary text-sm">University of Technology</p>
                </div>
                <span className="text-sm text-muted-foreground">2015 - 2019</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">GPA: 3.8/4.0 | Dean's List</p>
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Notable Projects
            </h2>
            <div className="grid gap-3">
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <h3 className="font-semibold">🚀 TaskFlow - Project Management Tool</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Full-stack application with real-time collaboration, Kanban boards, and team analytics.
                  Built with React, Node.js, Socket.io, and PostgreSQL.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <h3 className="font-semibold">🛒 ShopSmart - E-commerce Platform</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Scalable marketplace with inventory management, payment processing, and analytics dashboard.
                  Tech stack: Next.js, Stripe, MongoDB, Redis.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <h3 className="font-semibold">🤖 DevBot - AI Code Assistant</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  VS Code extension powered by GPT-4 for code generation, refactoring suggestions, and documentation.
                  50K+ downloads on VS Code Marketplace.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-border/50 text-xs text-muted-foreground">
            <p>References available upon request</p>
            <p className="mt-1">Last updated: December 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}