import React from 'react'
import { SearchBar } from './search'
import { Header, FilterSection, AgentsGrid, EmptyState, ResultsCount, Tabs } from './components'
import { useAgentsFilter } from './hooks/useAgentsFilter'
import { useAgentStore } from '@/store/agentStore'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'

export function Hub({ onSelectAgent }: { onSelectAgent?: (agent: any) => void }) {
  const {
    agents,
    filteredAgents,
    categories,
    selectedType,
    searchQuery,
    activeTab,
    setSelectedType,
    setSearchQuery,
    setActiveTab,
  } = useAgentsFilter()
  const { isLoading, error, fetchAgents, fetchInstalledAgents } = useAgentStore()
  const handleSelectAgent = onSelectAgent || (() => { })
  
  const handleRetry = () => {
    fetchAgents()
    fetchInstalledAgents()
  }
  return (
    <div className="flex max-w-7xl mt-12 justify-center mx-auto relative z-10 flex-col h-full rounded-lg p-8 gap-4">
      <div className="flex w-full justify-between items-center">
        <Header />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <Tabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />

      <FilterSection
        categories={categories}
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />

      <div className="flex-1 flex flex-col gap-3 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-foreground/60" size={24} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="text-center space-y-4 max-w-md">
              <AlertCircle className="mx-auto text-destructive" size={48} />
              <h2 className="text-2xl font-semibold text-foreground">Unable to Load Agents</h2>
              <p className="text-sm text-foreground/60">
                {error}
              </p>
              <Button onClick={handleRetry} variant="default">
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredAgents.length > 0 ? (
          <>
            <ResultsCount filtered={filteredAgents.length} total={agents.length} />
            <AgentsGrid agents={filteredAgents} onSelectAgent={handleSelectAgent} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
