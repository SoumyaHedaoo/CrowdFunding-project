import { TrendingUp, Users, Target, Clock } from "lucide-react"

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

type CampaignStatsProps = {
    campaigns: ParsedCampaign[]
}

export function CampaignStats({ campaigns }: CampaignStatsProps) {
    const totalRaised = campaigns.reduce((sum, campaign) => 
        sum + Number(campaign.amountCollected), 0
    )
    
    const totalTarget = campaigns.reduce((sum, campaign) => 
        sum + Number(campaign.target), 0
    )
    
    const activeCampaigns = campaigns.filter(c => c.status === "1").length
    
    const totalBackers = campaigns.reduce((sum, campaign) => 
        sum + (campaign.donators?.length || 0), 0
    )

    const stats = [
        {
            icon: TrendingUp,
            label: "Total Raised",
            value: `${totalRaised.toFixed(2)} ETH`,
            color: "text-[#4ade80]",
            bgColor: "bg-[#22c55e]/10"
        },
        {
            icon: Target,
            label: "Success Rate",
            value: `${totalTarget > 0 ? ((totalRaised / totalTarget) * 100).toFixed(1) : 0}%`,
            color: "text-[#3b82f6]",
            bgColor: "bg-[#3b82f6]/10"
        },
        {
            icon: Clock,
            label: "Active Campaigns",
            value: activeCampaigns.toString(),
            color: "text-[#a855f7]",
            bgColor: "bg-[#a855f7]/10"
        },
        {
            icon: Users,
            label: "Total Backers",
            value: totalBackers.toString(),
            color: "text-[#06b6d4]",
            bgColor: "bg-[#06b6d4]/10"
        }
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <div key={index} className="bg-[#2a2a2a] border border-[#374151] rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#9ca3af] mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold text-[#ffffff]">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}