import { useState, useEffect, useMemo } from 'react'
import { useAgentStore } from '@/store/agentStore'

export type TabType = 'recommended' | 'trending'

export function useAgentsFilter() {
  const { 
    agents, 
    fetchAgents, 
    isLoading 
  } = useAgentStore()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('recommended')

  // Fetch agents and installed agents on mount
  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  // Extract categories from agent data (using author as category for now, or can be extended)
  const categories = useMemo(() => {
    return Array.from(new Set(agents.map(a => a.author).filter(Boolean)))
  }, [agents])
  const filteredAgents = useMemo(() => {
    let tabFiltered = agents

    // Filter by tab
    switch (activeTab) {
      case 'recommended':
        // Recommended: Recently created agents (can be enhanced with rating system later)
        tabFiltered = agents
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'trending':
        // Trending: Most recently updated agents
        tabFiltered = agents
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, Math.ceil(agents.length * 0.3))
        break
    }
    // Apply type (author) and search filters
    return tabFiltered.filter(a => {
      const matchType = !selectedType || a.author === selectedType
      const matchSearch = !searchQuery ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.website_url && a.website_url.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchType && matchSearch
    })
  }, [agents, selectedType, searchQuery, activeTab])

  return {
    agents,
    filteredAgents,
    categories,
    selectedType,
    searchQuery,
    activeTab,
    isLoading,
    setSelectedType,
    setSearchQuery,
    setActiveTab,
  }
}

