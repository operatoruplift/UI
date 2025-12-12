import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

import { Agent } from '@/services/dashboard/hub/agentService'
import { readAgentFilesWithCommands } from '@/services/dashboard/workspace/installAgentCommandService'
import { useAuthStore } from '@/store/authStore'
import { getAgentState, setInstalled } from '@/services/dashboard/hub/agentStateService'
import { cn } from '@/lib/utils'
import { InstalledAgentUninstall } from './InstalledAgentUninstall'
import { useUninstallAgent } from '../hooks/useUninstallAgent'

interface InstalledAgentActionsProps {
    agent: Agent
    onBack: () => void
    onUninstall: () => void
}

export const InstalledAgentActions: React.FC<InstalledAgentActionsProps> = ({
    agent,
    onBack,
    onUninstall,
}) => {
    const { token } = useAuthStore()
    const [commands, setCommands] = useState<Record<string, (accessToken?: string, query?: string) => Promise<any>>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isExecuting, setIsExecuting] = useState<'setup' | 'agent' | 'run' | null>(null)
    const [agentState, setAgentState] = useState(getAgentState(agent.id))

    const { isUninstalling, handleUninstall } = useUninstallAgent({
        agentId: agent.id,
        onSuccess: () => {
            if (onUninstall) {
                onUninstall()
            }
            onBack()
        },
    })

    useEffect(() => {
        loadAgentFiles()
        // Refresh agent state from localStorage
        setAgentState(getAgentState(agent.id))
    }, [agent.id])

    const loadAgentFiles = async () => {
        try {
            setIsLoading(true)

            // Read agent files with commands, passing callbacks
            const fileData = await readAgentFilesWithCommands(
                agent.id,
            )
            if (fileData.commands) {
                setCommands(fileData.commands)
            }
        } catch (error) {
            // Error loading agent files
        } finally {
            setIsLoading(false)
        }
    }

    const handleAction = async (actionType: 'setup' | 'agent' | 'run') => {
        const commandFn = commands[actionType]
        if (!commandFn) return

        try {
            setIsExecuting(actionType)
            
            // Execute the command function with parameters
            await commandFn(token || "")

            // If setup was executed successfully, mark as installed in localStorage
            if (actionType === 'setup') {
                setInstalled(agent.id, true)
                setAgentState(getAgentState(agent.id))
            }
        } catch (error) {
            alert(`Failed to execute ${actionType}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsExecuting(null)
        }
    }


    if (isLoading) {
        return (
            <div className="pt-4 border-t border-foreground/10">
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="animate-spin text-foreground/60" size={20} />
                </div>
            </div>
        )
    }

    // Don't show if no commands available
    if (!commands.setup && !commands.agent && !commands.run) {
        return null
    }

    const isAgentInstalledState = agentState.installed
    return (
        <div className="border-foreground/10">
            <div className="flex flex-col gap-4">
                {commands.setup && (
                    <div className="flex justify-between items-center gap-2">
                        <div>
                            <p>Intialize Agent {!isAgentInstalledState && <span className="text-destructive font-medium text-xs"> (Action Required) </span>}</p>
                            <p className="text-sm text-foreground/60">Initialize your agent to the operating system</p>
                        </div>
                        <Button
                            variant={"outline"}
                            onClick={() => handleAction('setup')}
                            disabled={isExecuting !== null}
                            className={cn("", !isAgentInstalledState ? "col-span-3" : "")}
                        >
                            {isExecuting === 'setup' ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Running...
                                </>
                            ) : (
                                isAgentInstalledState ? 'Reset' : 'Setup'
                            )}
                        </Button>
                    </div>
                )}
                <InstalledAgentUninstall
                    agentName={agent.name}
                    isUninstalling={isUninstalling}
                    onUninstall={handleUninstall}
                />
            </div>
        </div>
    )
}

