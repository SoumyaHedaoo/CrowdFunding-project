import { ArrowRight, Shield, Zap, Users, Lock, TrendingUp, Network } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#1a1a1a] overflow-hidden">
      {/* Background Visuals */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/30 to-[#2a2a2a]/20 pointer-events-none" />

      {/* Floating Glows */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#3b82f6]/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-[#a855f7]/20 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-[#06b6d4]/20 rounded-full blur-2xl animate-pulse delay-500" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a2a2a]/50 backdrop-blur border border-[#374151] rounded-full">
            <Shield className="w-5 h-5 text-[#06b6d4]" />
            <span className="text-sm text-[#e6e6e6] font-medium">Secured by Blockchain</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a2a2a]/50 backdrop-blur border border-[#374151] rounded-full">
            <Network className="w-5 h-5 text-[#a855f7]" />
            <span className="text-sm text-[#e6e6e6] font-medium">Powered by Arbitrum</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="group text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(74,222,128,0.4)]">
  Empower the{" "}
  <span className="bg-gradient-to-r from-[#22c55e] to-[#4ade80] bg-clip-text text-transparent transition-all duration-500 group-hover:tracking-wider group-hover:drop-shadow-md">
    Future of Funding
  </span>
</h1>


        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[#9ca3af] max-w-3xl mx-auto mb-10 leading-relaxed">
          Join a trustless, transparent platform that lets you support causes and projects without intermediaries.
          Built on blockchain for integrity, speed, and accountability.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <a
            href="/home"
            className="group bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#06b6d4]/90 hover:to-[#3b82f6]/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center"
          >
            Explore Campaigns
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="/create-campaign"
            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 hover:border-white/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            Create Campaign
            <Zap className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
          </a>
        </div>

        {/* How It Works */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-[#2a2a2a] p-6 rounded-2xl border border-[#374151] hover:bg-[#111827]/50 transition">
              <Zap className="w-8 h-8 mx-auto text-[#06b6d4] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Launch a Campaign</h3>
              <p className="text-[#9ca3af] text-sm">Create a campaign with your vision and funding goal.</p>
            </div>
            <div className="group bg-[#2a2a2a] p-6 rounded-2xl border border-[#374151] hover:bg-[#111827]/50 transition">
              <Users className="w-8 h-8 mx-auto text-[#a855f7] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Attract Backers</h3>
              <p className="text-[#9ca3af] text-sm">Reach a community that believes in your mission.</p>
            </div>
            <div className="group bg-[#2a2a2a] p-6 rounded-2xl border border-[#374151] hover:bg-[#111827]/50 transition">
              <TrendingUp className="w-8 h-8 mx-auto text-[#22c55e] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Fund and Grow</h3>
              <p className="text-[#9ca3af] text-sm">Receive funds securely via blockchain and expand your impact.</p>
            </div>
          </div>
        </div>

        {/* Stats Header */}
<div className="text-center mb-12">
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Us?</h2>
  <p className="text-[#9ca3af] text-lg max-w-2xl mx-auto">
    We are redefining the future of funding by combining transparency, speed, and global support — all powered by blockchain.
  </p>
</div>


        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-[#2a2a2a] rounded-2xl p-8 border border-[#374151] hover:bg-[#111827]/50 transition-all duration-300">
            <Users className="w-8 h-8 mx-auto text-[#3b82f6] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-1">10,000+ Backers</h3>
            <p className="text-[#9ca3af] text-sm">People who trust and support our mission</p>
          </div>

          <div className="text-center bg-[#2a2a2a] rounded-2xl p-8 border border-[#374151] hover:bg-[#111827]/50 transition-all duration-300">
            <Lock className="w-8 h-8 mx-auto text-[#a855f7] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-1">100% Secure</h3>
            <p className="text-[#9ca3af] text-sm">Blockchain-backed donations for transparency</p>
          </div>

          <div className="text-center bg-[#2a2a2a] rounded-2xl p-8 border border-[#374151] hover:bg-[#111827]/50 transition-all duration-300">
            <TrendingUp className="w-8 h-8 mx-auto text-[#00c896] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-1">$2M+ Raised</h3>
            <p className="text-[#9ca3af] text-sm">Successful campaigns across the globe</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
