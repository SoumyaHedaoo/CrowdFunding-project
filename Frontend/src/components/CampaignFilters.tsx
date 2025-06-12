import { useState } from "react"
import { Search, Filter, SlidersHorizontal } from "lucide-react"

type FilterOptions = {
    search: string
    sortBy: 'newest' | 'oldest' | 'funded' | 'deadline'
    category: 'all' | 'active' | 'ending-soon'
}

type CampaignFiltersProps = {
    onFilterChange: (filters: FilterOptions) => void
    totalCount: number
}

export function CampaignFilters({ onFilterChange, totalCount }: CampaignFiltersProps) {
    const [filters, setFilters] = useState<FilterOptions>({
        search: '',
        sortBy: 'newest',
        category: 'all'
    })
    const [showFilters, setShowFilters] = useState(false)

    const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
        const updated = { ...filters, ...newFilters }
        setFilters(updated)
        onFilterChange(updated)
    }

    return (
        <div className="bg-[#2a2a2a] border border-[#374151] rounded-xl p-6 mb-8 shadow-sm">
            {/* Search and Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange({ search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#374151] bg-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] transition-colors text-[#e6e6e6]"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-[#9ca3af] font-medium">
                        {totalCount} campaigns
                    </span>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2.5 border border-[#374151] bg-[#1a1a1a] rounded-lg hover:bg-[#374151] transition-colors text-[#e6e6e6]"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#374151]">
                    <div>
                        <label className="block text-sm font-medium text-[#e6e6e6] mb-2">
                            Sort by
                        </label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
                            className="w-full px-3 py-2 border border-[#374151] bg-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] text-[#e6e6e6]"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="funded">Most Funded</option>
                            <option value="deadline">Ending Soon</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#e6e6e6] mb-2">
                            Category
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange({ category: e.target.value as FilterOptions['category'] })}
                            className="w-full px-3 py-2 border border-[#374151] bg-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] text-[#e6e6e6]"
                        >
                            <option value="all">All Campaigns</option>
                            <option value="active">Active Only</option>
                            <option value="ending-soon">Ending Soon</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    )
}