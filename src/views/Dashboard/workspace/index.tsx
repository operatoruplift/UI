import React, { useState } from 'react'
import { WorkspaceComingSoon } from './components/ComingSoon'
import { WorkspaceContent } from './components/WorkspaceContent'

export const Workspace: React.FC = () => {
  // const [showComingSoon] = useState(true)

  // if (showComingSoon) {
  //   return <WorkspaceComingSoon />
  // }

  return <WorkspaceContent />
}

