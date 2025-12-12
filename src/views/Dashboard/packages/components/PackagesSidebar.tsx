import React from 'react'
import { Plus, Folder, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Project {
  id: string
  name: string
  sessions?: Session[]
}

interface Session {
  id: string
  name: string
  memory?: boolean
}

interface PackagesSidebarProps {
  projects?: Project[]
  selectedProjectId?: string | null
  selectedSessionId?: string | null
  onSelectProject?: (projectId: string) => void
  onSelectSession?: (projectId: string, sessionId: string) => void
  onCreateProject?: () => void
}

export const PackagesSidebar: React.FC<PackagesSidebarProps> = ({
  projects = [],
  selectedProjectId = null,
  selectedSessionId = null,
  onSelectProject,
  onSelectSession,
  onCreateProject,
}) => {
  return (
    <div className="flex text-sm flex-col h-full border-r border-foreground/10">

      <button
        onClick={onCreateProject}
        className="w-full p-1.5 px-4 hover:bg-foreground/5 transition-colors border-b border-foreground/10 flex items-center text-foreground justify-start gap-2"
      >
        <Plus size={16} />
        New Project
      </button>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {projects.length === 0 ? (
            <div className="flex flex-col py-6 px-4">
              <Folder size={28} className="text-foreground/30 mb-2" />
              <p className="text-sm text-foreground/60 mb-1">No projects yet</p>
              <p className="text-sm text-foreground/40">
                Create your first project to get started
              </p>
            </div>
          ) : (
            projects.map((project) => {
              const isSelected = selectedProjectId === project.id

              return (
                <div key={project.id}>
                  <div
                    onClick={() => onSelectProject?.(project.id)}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-all
                      ${isSelected
                        ? 'bg-foreground/5 text-foreground'
                        : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                      }
                    `}
                  >
                    <Folder size={14} className="text-primary/70 flex-shrink-0" />
                    <span className="flex-1 text-sm truncate">
                      {project.name}
                    </span>
                    {isSelected && <ChevronRight size={14} className="flex-shrink-0" />}
                  </div>

                  {isSelected && project.sessions && project.sessions.length > 0 && (
                    <div className="ml-6 mt-1 space-y-0.5 border-l border-foreground/10 pl-3">
                      {project.sessions.map((session) => {
                        const isSessionSelected = selectedSessionId === session.id
                        return (
                          <div
                            key={session.id}
                            onClick={() => onSelectSession?.(project.id, session.id)}
                            className={`flex items-center gap-2 px-2 py-1 text-sm transition-colors cursor-pointer rounded ${
                              isSessionSelected
                                ? 'text-foreground bg-foreground/5'
                                : 'text-foreground/60 hover:text-foreground/80 hover:bg-foreground/5'
                            }`}
                          >
                            <ChevronRight size={10} className="text-foreground/40" />
                            <span className="truncate">{session.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

