import { useContext, useEffect, useState } from "react"
import { StateContext } from "../contexts"
import { Heart, Users, Target, Clock, Search, Shield, Globe } from "lucide-react"
import DisplayCampaigns from "../components/displayCampaigns"
import { CampaignFilters } from "../components/CampaignFilters"
import { CampaignStats } from "../components/CampaignStats"

type ParsedCampaign = {
    owner: string
    title: string
    description: string
    target: string
    deadline: number
    amountCollected: string
    image: string
    status: string
    pId: string
    rejectionReason?: string
    donators?: string
}

type FilterOptions = {
    search: string
    sortBy: 'newest' | 'oldest' | 'funded' | 'deadline'
    category: 'all' | 'active' | 'ending-soon'
}





export function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const [allCampaigns, setAllCampaigns] = useState<ParsedCampaign[]>([])
    const [filteredCampaigns, setFilteredCampaigns] = useState<ParsedCampaign[]>([])
    const [filters, setFilters] = useState<FilterOptions>({
        search: '',
        sortBy: 'newest',
        category: 'all'
    })

    const { address, contract, getApprovedCampaigns, searchCampaign } = useContext(StateContext)

    async function fetchCampaigns() {
        setIsLoading(true)
        try {
            const data = await getApprovedCampaigns()
            setAllCampaigns(data)
        } catch (error) {
            console.error("Error fetching campaigns:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        let filtered = [...allCampaigns]

        const searchTerm = filters.search || searchCampaign
        if (searchTerm) {
            filtered = filtered.filter((campaign) =>
                campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (filters.category === 'active') {
            filtered = filtered.filter(campaign => campaign.status === "1")
        } else if (filters.category === 'ending-soon') {
            const now = Date.now()
            filtered = filtered.filter(campaign => {
                const timeLeft = campaign.deadline * 1000 - now
                return timeLeft > 0 && timeLeft <= 7 * 24 * 60 * 60 * 1000
            })
        }

        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'newest':
                    return b.deadline - a.deadline
                case 'oldest':
                    return a.deadline - b.deadline
                case 'funded':
                    return Number(b.amountCollected) - Number(a.amountCollected)
                case 'deadline':
                    return a.deadline - b.deadline
                default:
                    return 0
            }
        })

        setFilteredCampaigns(filtered)
    }, [allCampaigns, filters, searchCampaign])

    useEffect(() => {
        if (contract) {
            fetchCampaigns()
        }
    }, [address, contract])

    return (
        <div className="min-h-screen bg-[#1a1a1a]">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#ffffff] mb-6">
                        Humanitarian Missions
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-[#34d399] mt-2">
                            Powered by Trust
                        </span>
                    </h1>
                    <p className="text-lg text-[#9ca3af] max-w-3xl mx-auto mb-8">
                        Support verified NGO campaigns with complete transparency. Every donation is tracked on the blockchain, 
                        ensuring your contribution makes a real difference.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-[#9ca3af]">
                        <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-[#4ade80]" />
                            Blockchain Verified
                        </div>
                        <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-[#3b82f6]" />
                            Global Impact
                        </div>
                        <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-2 text-[#ec4899]" />
                            Transparent Giving
                        </div>
                    </div>
                </div>

                {/* Stats */}
                {!isLoading && allCampaigns.length > 0 && (
                    <CampaignStats campaigns={allCampaigns} />
                )}
                
                {/* Filters */}
                {!isLoading && allCampaigns.length > 0 && (
                    <CampaignFilters 
                        onFilterChange={setFilters}
                        totalCount={filteredCampaigns.length}
                    />
                )}
                
                {/* Campaigns */}
                <DisplayCampaigns 
    title="Active Campaigns"
    isLoading={isLoading}
    campaigns={filteredCampaigns}
    showAllCampaigns={false} // or omit this prop as default is false
/>
            </div>
        </div>
    )
}