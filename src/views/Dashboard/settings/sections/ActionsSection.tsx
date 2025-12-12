import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useChatStore } from '@/store/chatStore'
import { clearChatHistory as clearChatHistoryAPI } from '@/services/dashboard/chat/chatService'
import { clearChatHistory } from '@/store/shortcutStore'
import { Trash2, AlertTriangle } from 'lucide-react'

export const ActionsSection: React.FC = () => {
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleClearChatHistory = async () => {
    try {
      setIsClearing(true)
      
      // Clear history on the backend
      await clearChatHistoryAPI()
      
      // Clear local storage using centralized function
      clearChatHistory(false)
      setShowClearDialog(false)
      // You could add a success toast/notification here if needed
    } catch (error) {
      console.error('Error clearing chat history:', error)
      // You could add an error toast/notification here if needed
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto flex flex-col h-full p-6">
      <div className="p-4 rounded-lg bg-foreground/[0.01] border border-foreground/10">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Trash2 size={18} className="text-foreground/60" />
              <h3 className="text-sm text-foreground">
                Clear Chat History
              </h3>
            </div>
            <p className="text-sm text-foreground/60">
              Permanently delete all your chat messages. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowClearDialog(true)}
            >
              Clear Chat History
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle size={18} className="text-destructive" />
              Clear Chat History?
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground/60">
              Are you sure you want to permanently delete all your chat messages? This action cannot be undone and will remove all conversation history from this device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearDialog(false)}
              disabled={isClearing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearChatHistory}
              disabled={isClearing}
            >
              {isClearing ? 'Clearing...' : 'Clear All Messages'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

