import { useContext, useEffect, useState } from "react";
import { Location, useLocation } from "react-router-dom";
import { StateContext } from "../contexts";
import { calculateBarPercentage, daysLeft } from "../utils";
import { Loader } from "../components/loader";
import { Users, Target, Calendar, Shield, TrendingUp, Heart } from "lucide-react";

type ParsedCampaign = {
    owner: string;
    title: string;
    description: string;
    target: string;
    deadline: number;
    amountCollected: string;
    image: string;
    pId: string;
};

type ParsedDonation = {
    donator: string;
    donation: string;
};

export function CampaignDetails() {
    const { state } = useLocation() as Location<ParsedCampaign>;
    const { donate, getDonations, contract, address } = useContext(StateContext);

    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [donators, setDonators] = useState<ParsedDonation[]>([]);

    const remainingDays = daysLeft(state.deadline);
    const progressPercentage = calculateBarPercentage(Number(state.target), Number(state.amountCollected));

    async function fetchDonators() {
        const data = await getDonations(state.pId);
        setDonators(data);
    }

    useEffect(() => {
        if (contract) {
            fetchDonators();
        }
    }, [contract, address]);

    async function handleDonate() {
        setIsLoading(true);
        try {
            await donate(state.pId, amount);
            await fetchDonators();
            setAmount("");
        } catch (err) {
            console.log(err);
        }
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
            {isLoading && <Loader />}
            
            {/* Header Section */}
            <div className="px-6 py-8 md:px-10 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    {/* Trust Badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="w-5 h-5" style={{ color: '#a855f7' }} />
                        <span className="text-sm font-medium" style={{ color: '#a855f7' }}>
                            Blockchain Verified Campaign
                        </span>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Campaign Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Campaign Image & Progress */}
                            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#2a2a2a' }}>
                                <img 
                                    src={state.image} 
                                    alt="campaign" 
                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="p-6">
                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-medium" style={{ color: '#9ca3af' }}>
                                                Campaign Progress
                                            </span>
                                            <span className="text-sm font-bold" style={{ color: '#22c55e' }}>
                                                {progressPercentage}%
                                            </span>
                                        </div>
                                        <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#374151' }}>
                                            <div 
                                                className="h-full rounded-full transition-all duration-500 ease-out"
                                                style={{ 
                                                    width: `${progressPercentage}%`,
                                                    background: 'linear-gradient(90deg, #059669 0%, #34d399 100%)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#111827' }}>
                                            <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: '#3b82f6' }} />
                                            <div className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
                                                {remainingDays}
                                            </div>
                                            <div className="text-xs" style={{ color: '#9ca3af' }}>Days Left</div>
                                        </div>
                                        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#111827' }}>
                                            <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: '#22c55e' }} />
                                            <div className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
                                                {state.amountCollected}
                                            </div>
                                            <div className="text-xs" style={{ color: '#9ca3af' }}>
                                                of {state.target} ETH
                                            </div>
                                        </div>
                                        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#111827' }}>
                                            <Users className="w-6 h-6 mx-auto mb-2" style={{ color: '#ec4899' }} />
                                            <div className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
                                                {donators.length}
                                            </div>
                                            <div className="text-xs" style={{ color: '#9ca3af' }}>Supporters</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Description */}
                            <div className="p-6 rounded-xl" style={{ backgroundColor: '#2a2a2a' }}>
                                <h1 className="text-3xl font-bold mb-4" style={{ color: '#ffffff' }}>
                                    {state.title}
                                </h1>
                                <p className="text-lg leading-relaxed" style={{ color: '#e6e6e6' }}>
                                    {state.description}
                                </p>
                            </div>

                            {/* Donators List */}
                            <div className="p-6 rounded-xl" style={{ backgroundColor: '#2a2a2a' }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <Heart className="w-6 h-6" style={{ color: '#ec4899' }} />
                                    <h3 className="text-xl font-semibold" style={{ color: '#ffffff' }}>
                                        Recent Supporters
                                    </h3>
                                </div>
                                
                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                    {donators.length > 0 ? (
                                        donators.map((donator, index) => (
                                            <div 
                                                key={`${donator.donator}-${donator.donation}-${index}`}
                                                className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                                                style={{ backgroundColor: '#111827', borderLeft: '3px solid #22c55e' }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" 
                                                         style={{ backgroundColor: '#374151', color: '#22c55e' }}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium" style={{ color: '#e6e6e6' }}>
                                                            {donator.donator.slice(0, 6)}...{donator.donator.slice(-4)}
                                                        </p>
                                                        <p className="text-xs" style={{ color: '#9ca3af' }}>
                                                            Blockchain Verified
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg" style={{ color: '#22c55e' }}>
                                                        {donator.donation} ETH
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: '#9ca3af' }} />
                                            <p className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
                                                No supporters yet
                                            </p>
                                            <p className="text-sm" style={{ color: '#9ca3af' }}>
                                                Be the first to support this campaign
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Donation Panel */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8">
                                <div className="p-6 rounded-xl" style={{ backgroundColor: '#2a2a2a' }}>
                                    <div className="text-center mb-6">
                                        <Target className="w-8 h-8 mx-auto mb-3" style={{ color: '#22c55e' }} />
                                        <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>
                                            Support This Campaign
                                        </h3>
                                        <p className="text-sm" style={{ color: '#9ca3af' }}>
                                            Your donation is secured by blockchain technology
                                        </p>
                                    </div>

                                    {/* Donation Form */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#e6e6e6' }}>
                                                Donation Amount (ETH)
                                            </label>
                                            <div className="relative">
                                                <input 
                                                    type="number" 
                                                    placeholder="0.1" 
                                                    step="0.01"
                                                    className="w-full py-3 px-4 rounded-lg text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2"
                                                    style={{ 
                                                        backgroundColor: '#111827', 
                                                        color: '#ffffff',
                                                        border: '1px solid #374151',
                                                        
                                                    }}
                                                    value={amount} 
                                                    onChange={(e) => setAmount(e.target.value)}
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium" 
                                                     style={{ color: '#9ca3af' }}>
                                                    ETH
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleDonate}
                                            disabled={isLoading || !amount}
                                            className="w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ 
                                                background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
                                                color: '#ffffff'
                                            }}
                                        >
                                            {isLoading ? 'Processing...' : 'Donate Now'}
                                        </button>

                                        {/* Trust Indicators */}
                                        <div className="pt-4 border-t" style={{ borderColor: '#374151' }}>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Shield className="w-4 h-4" style={{ color: '#3b82f6' }} />
                                                    <span className="text-xs" style={{ color: '#9ca3af' }}>
                                                        Secured by Smart Contract
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <TrendingUp className="w-4 h-4" style={{ color: '#3b82f6' }} />
                                                    <span className="text-xs" style={{ color: '#9ca3af' }}>
                                                        Transparent Transaction History
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Campaign Owner Info */}
                                <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: '#2a2a2a' }}>
                                    <h4 className="font-semibold mb-3" style={{ color: '#ffffff' }}>
                                        Campaign Creator
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" 
                                             style={{ backgroundColor: '#a855f7', color: '#ffffff' }}>
                                            {state.owner.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm" style={{ color: '#e6e6e6' }}>
                                                {state.owner.slice(0, 6)}...{state.owner.slice(-4)}
                                            </p>
                                            <p className="text-xs" style={{ color: '#9ca3af' }}>
                                                Verified on Blockchain
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}