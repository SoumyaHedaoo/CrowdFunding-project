import { useNavigate } from "react-router-dom"
import {  daysLeft } from "../utils"
import { Calendar, Users, TrendingUp, ExternalLink } from "lucide-react"

type ParsedCampaign = {
    owner: string
    title: string
    description: string
    target: string
    deadline: number
    amountCollected: string
    image: string
    pId: string
    status: string
    rejectionReason?: string
    donators?: string
}

type DisplayCampaignsProps = {
    title: string
    isLoading: boolean
    campaigns: ParsedCampaign[]
    showAllCampaigns?: boolean // Add this prop to control filtering
}

export default function DisplayCampaigns({
    title,
    isLoading,
    campaigns,
    showAllCampaigns = false, // Default to false (filter campaigns)
}: DisplayCampaignsProps) {
    const navigate = useNavigate()

    function handleNavigate(campaign: ParsedCampaign) {
        navigate(`/campaign-details/${campaign.title}`, { state: campaign })
    }

    // Filter campaigns based on showAllCampaigns prop
    const filteredCampaigns = showAllCampaigns 
        ? campaigns 
        : campaigns.filter(campaign => {
            const daysRemaining = daysLeft(campaign.deadline)
            const progressPercentage = ((Number(campaign.amountCollected) / Number(campaign.target)) * 100)
            
            // Show only campaigns that are:
            // 1. Active (status === "1")
            // 2. Not past deadline (daysRemaining > 0)
            // 3. Not fully funded (progressPercentage < 100)
            return campaign.status === "1" && 
                   daysRemaining > 0 && 
                   progressPercentage < 100
        })

    const CampaignCard = ({ campaign }: { campaign: ParsedCampaign }) => {
        const progressPercentage = ((Number(campaign.amountCollected) / Number(campaign.target)) * 100)
        const daysRemaining = daysLeft(campaign.deadline)
        
        const getStatusBadge = () => {
            switch(campaign.status) {
                case "0": 
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30">
                            Pending Review
                        </span>
                    );
                case "1": 
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">
                            Active
                        </span>
                    );
                case "2": 
                    return (
                        <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30">
                                Rejected
                            </span>
                            {campaign.rejectionReason && (
                                <span className="text-[#f43f5e] text-xs mt-1 line-clamp-2">
                                    {campaign.rejectionReason}
                                </span>
                            )}
                        </div>
                    );
                default: 
                    return null;
            }
        };

        const getUrgencyIndicator = () => {
            if (daysRemaining <= 3 && daysRemaining > 0) {
                return "urgent"
            } else if (daysRemaining <= 7 && daysRemaining > 3) {
                return "warning"
            }
            return "normal"
        }

        const urgency = getUrgencyIndicator()

        // Add visual indicators for completed/expired campaigns when showing all campaigns
        const isExpired = daysRemaining <= 0
        const isFullyFunded = progressPercentage >= 100
        const isCompleted = isExpired || isFullyFunded

        return (
            <div 
                className={`group relative bg-[#2a2a2a] rounded-2xl shadow-sm border border-[#374151] hover:shadow-xl hover:border-[#4ade80] transition-all duration-300 cursor-pointer overflow-hidden ${
                    isCompleted && showAllCampaigns ? 'opacity-75' : ''
                }`}
                onClick={() => handleNavigate(campaign)}
            >
                {/* Completion Badge for profile page */}
                {showAllCampaigns && isCompleted && (
                    <div className="absolute top-4 right-4 z-10 bg-[#6b7280] text-white px-2 py-1 rounded-full text-xs font-medium">
                        {isFullyFunded ? 'Funded' : 'Ended'}
                    </div>
                )}

                {/* Urgency Indicator */}
                {urgency === "urgent" && !isCompleted && (
                    <div className="absolute top-4 left-4 z-10 bg-[#f43f5e] text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                        Urgent
                    </div>
                )}
                {urgency === "warning" && !isCompleted && (
                    <div className="absolute top-4 left-4 z-10 bg-[#f59e0b] text-white px-2 py-1 rounded-full text-xs font-medium">
                        Ending Soon
                    </div>
                )}

                {/* Image Section */}
                <div className="relative h-52 bg-gradient-to-br from-[#111827] to-[#1a1a1a] overflow-hidden">
                    <img 
                        src={campaign.image} 
                        alt={campaign.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Floating Time Badge */}
                    <div className="absolute bottom-4 right-4 bg-[#2a2a2a]/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[#e6e6e6]">
                            <Calendar className="w-4 h-4" />
                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Ended'}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#34d399] to-[#059669] flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                                {campaign.owner.slice(2, 4).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-[#9ca3af] truncate">
                                    {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
                                </p>
                            </div>
                        </div>
                        {getStatusBadge()}
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-[#ffffff] line-clamp-2 group-hover:text-[#4ade80] transition-colors">
                            {campaign.title}
                        </h3>
                        <p className="text-[#9ca3af] line-clamp-3 text-sm leading-relaxed">
                            {campaign.description}
                        </p>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-4">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-[#4ade80]">
                                    {progressPercentage.toFixed(1)}% funded
                                </span>
                                <span className="text-[#9ca3af]">
                                    Goal: {campaign.target} ETH
                                </span>
                            </div>
                            <div className="w-full bg-[#374151] rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-[#059669] to-[#34d399] h-2.5 rounded-full transition-all duration-700 ease-out shadow-sm"
                                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-[#1a1a1a] rounded-lg">
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <TrendingUp className="w-4 h-4 text-[#4ade80]" />
                                    <span className="text-lg font-bold text-[#ffffff]">
                                        {campaign.amountCollected}
                                    </span>
                                </div>
                                <p className="text-xs text-[#9ca3af] font-medium">ETH Raised</p>
                            </div>
                            <div className="text-center p-3 bg-[#1a1a1a] rounded-lg">
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <Users className="w-4 h-4 text-[#3b82f6]" />
                                    <span className="text-lg font-bold text-[#ffffff]">
                                        {campaign.donators?.length || 0}
                                    </span>
                                </div>
                                <p className="text-xs text-[#9ca3af] font-medium">Backers</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                        <button className="w-full bg-gradient-to-r from-[#059669] to-[#34d399] hover:from-[#047857] hover:to-[#059669] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group-hover:scale-[1.02]">
                            View Details
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#111827]">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#ffffff] mb-4">
                        {title}
                    </h1>
                    <p className="text-xl text-[#9ca3af] max-w-2xl mx-auto">
                        {showAllCampaigns 
                            ? "All your campaigns and their current status"
                            : "Discover and support innovative projects from creators around the world"
                        }
                    </p>
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-[#22c55e]/10 rounded-full">
                        <span className="text-[#4ade80] font-semibold">
                            {filteredCampaigns.length} {showAllCampaigns ? 'Total' : 'Active'} Campaigns
                        </span>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#22c55e]/20 border-t-[#22c55e]" />
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#34d399] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                        </div>
                        <p className="mt-4 text-[#9ca3af] font-medium">Loading amazing campaigns...</p>
                    </div>
                ) : (
                    <>
                        {/* Empty State */}
                        {filteredCampaigns.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="mx-auto w-24 h-24 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-6">
                                    <TrendingUp className="w-12 h-12 text-[#9ca3af]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#ffffff] mb-2">
                                    {showAllCampaigns ? 'No campaigns found' : 'No active campaigns found'}
                                </h3>
                                <p className="text-[#9ca3af] mb-6 max-w-md mx-auto">
                                    {showAllCampaigns 
                                        ? 'You haven\'t created any campaigns yet. Start your first campaign today!'
                                        : 'All campaigns are either completed, expired, or pending review. Check back later for new opportunities!'
                                    }
                                </p>
                                <button className="bg-[#22c55e] hover:bg-[#1a9c4a] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                onClick={() => navigate('/create-campaign')}
                                >
                                    Create Campaign
                                </button>
                            </div>
                        ) : (
                            /* Campaign Grid */
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredCampaigns.map((campaign) => (
                                    <CampaignCard 
                                        key={campaign.pId}
                                        campaign={campaign}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    )
}