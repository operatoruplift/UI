import React, { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileListModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paths: string[]
  onPathClick: (path: string) => Promise<void>
}

export const FileListModal: React.FC<FileListModalProps> = ({
  open,
  onOpenChange,
  paths,
  onPathClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPaths = useMemo(() => {
    if (!searchQuery.trim()) return paths
    const query = searchQuery.toLowerCase()
    return paths.filter(path => path.toLowerCase().includes(query))
  }, [paths, searchQuery])

  const isImage = (path: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico']
    const lowerPath = path.toLowerCase()
    return imageExtensions.some(ext => lowerPath.endsWith(ext))
  }

  const handlePathClick = async (path: string) => {
    await onPathClick(path)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Files ({paths.length})</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={16} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </Button>
            )}
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto">
            {filteredPaths.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                No files found matching "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-4">
                {/* Separate images and non-images */}
                {(() => {
                  const imagePaths = filteredPaths.filter(p => isImage(p))
                  const nonImagePaths = filteredPaths.filter(p => !isImage(p))
                  
                  return (
                    <>
                      {/* Image Grid */}
                      {imagePaths.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                          {imagePaths.map((path, index) => (
                            <div
                              key={`img-${index}`}
                              onClick={() => handlePathClick(path)}
                              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-foreground/5 group"
                            >
                              <img
                                src={path}
                                alt={path}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  const parent = e.currentTarget.parentElement
                                  if (parent) {
                                    parent.innerHTML = `<div class="p-2 text-xs text-foreground/60 break-all h-full flex items-center">${path}</div>`
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Non-image paths */}
                      {nonImagePaths.length > 0 && (
                        <div className="space-y-2">
                          {nonImagePaths.map((path, index) => (
                            <div
                              key={`file-${index}`}
                              onClick={() => handlePathClick(path)}
                              className="text-sm font-mono px-3 py-2 rounded bg-foreground/5 hover:bg-foreground/10 cursor-pointer transition-colors"
                            >
                              <span className="text-foreground/80 break-all">{path}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

