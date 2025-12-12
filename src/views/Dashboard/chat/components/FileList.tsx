import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Expand } from 'lucide-react'
import { FileListModal } from './FileListModal'

interface FileListProps {
  paths: string[]
}

export const FileList: React.FC<FileListProps> = ({ paths }) => {
  paths = paths.filter(path => path !== null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isImage = (path: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico']
    const lowerPath = path.toLowerCase()
    return imageExtensions.some(ext => lowerPath.endsWith(ext))
  }
  const { imagePaths, nonImagePaths } = useMemo(() => {
    const images: string[] = []
    const nonImages: string[] = []

    paths.forEach(path => {
      if (isImage(path)) {
        images.push(path)
      } else {
        nonImages.push(path)
      }
    })

    return { imagePaths: images, nonImagePaths: nonImages }
  }, [paths])

  // Show first 4 items total (prioritize images, then non-images)
  const displayCount = Math.min(4, paths.length)
  const displayImagePaths = imagePaths.slice(0, displayCount)
  const remainingSlots = displayCount - displayImagePaths.length
  const displayNonImagePaths = remainingSlots > 0 ? nonImagePaths.slice(0, remainingSlots) : []
  const hasMore = paths.length > 4

  const handlePathClick = async (path: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        // Try using openPath first (preferred method)
        if ((window as any).electronAPI.openPath) {
          await (window as any).electronAPI.openPath(path)
        } else if ((window as any).electronAPI.executeCommand) {
          // Fallback: use spawn command to open file
          const platform = navigator.platform.toLowerCase()
          let command: string

          if (platform.includes('win')) {
            // Windows: use start command
            command = `start "" "${path}"`
          } else if (platform.includes('mac')) {
            // macOS: use open command
            command = `open "${path}"`
          } else {
            // Linux: use xdg-open
            command = `xdg-open "${path}"`
          }

          await (window as any).electronAPI.executeCommand(command, { detached: true })
        }
      }
    } catch (error) {
      console.error('Error opening path:', error)
    }
  }

  return (
    <>
      <div className="space-y-3 bg-muted p-4 rounded-lg">
        {/* Image Grid - Show first 4 images in a grid */}
        {displayImagePaths.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {displayImagePaths.map((path, index) => (
              <div
                key={index}
                onClick={() => handlePathClick(path)}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-foreground/5 group"
              >
                <img
                  src={path}
                  alt={path}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Show path text if image fails to load
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.innerHTML = `<div class="p-2 text-xs text-foreground/60 break-all">${path}</div>`
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {/* Non-image paths - Show first 4 non-image files */}
        {displayNonImagePaths.length > 0 && (
          <div className="space-y-1">
            {displayNonImagePaths.map((path, index) => (
              <div
                key={index}
                onClick={() => handlePathClick(path)}
                className="text-sm text-foreground/80 font-mono p-2 rounded bg-foreground/5 hover:bg-foreground/10 cursor-pointer transition-colors"
              >
                {path}
              </div>
            ))}
          </div>
        )}

        {/* Expand Button */}
        {hasMore && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="w-fit"
          >
            <Expand size={16} className="mr-2" />
            View More ({paths.length - displayCount})
          </Button>
        )}
      </div>

      {/* Modal */}
      <FileListModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        paths={paths}
        onPathClick={handlePathClick}
      />
    </>
  )
}

