import { useContext, useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import { Loader } from "../components/loader";
import { StateContext } from "../contexts";

export function AdminDashboard() {
  const navigate = useNavigate();
  const {
    getPendingCampaigns,
        getCampaigns,
        approveCampaign,
        rejectCampaign,
        refreshCampaigns,
        contract,
        address,
        isAdmin,
        adminCheckCompleted
  } = useContext(StateContext);

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [campaignCount, setCampaignCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: string]: string }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check authorization status
  const isAuthorized = address && isAdmin;

  useEffect(() => {
    if (adminCheckCompleted) {
        // Don't redirect, just let the component handle the display
        if (isAuthorized) {
            // Only load data if authorized
            const loadInitialData = async () => {
                if (!contract) {
                    setError("Contract not available");
                    setLoading(false);
                    return;
                }
                
                try {
                    await handleRefresh();
                } catch (err) {
                    console.error("Error loading initial data:", err);
                    setError("Failed to load initial data");
                    setLoading(false);
                }
            };
            
            loadInitialData();
        } else {
            setLoading(false);
        }
    }
}, [address, isAdmin, adminCheckCompleted, contract]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setLoading(true);
    setError("");
    
    try {
      await refreshCampaigns();
      
      if (contract) {
        const count = await contract.call('numberOfCampaigns');
        setCampaignCount(parseInt(count.toString()));
      }
      
      const pendingData = await getPendingCampaigns();
      setCampaigns(pendingData);
      
      const allData = await getCampaigns();
      setAllCampaigns(allData);
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh data: " + (err as Error).message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      await approveCampaign(id);
      await handleRefresh();
    } catch (error) {
      console.error("Approval failed:", error);
      setError("Approval failed: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReasons[id]?.trim()) {
      setError("Please provide a rejection reason");
      return;
    }
    
    try {
      setLoading(true);
      await rejectCampaign(id, rejectionReasons[id]);
      await handleRefresh();
    } catch (error) {
      console.error("Rejection failed:", error);
      setError("Rejection failed: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while admin check is in progress
  if (!adminCheckCompleted || (loading && isAuthorized)) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-300 text-lg">
          {!adminCheckCompleted ? "Checking authorization..." : 
           isRefreshing ? "Refreshing campaign data..." : "Loading admin dashboard..."}
        </p>
      </div>
    );
  }

  // Show unauthorized message if user is not admin or not logged in
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          
          <div className="space-y-4 text-gray-300">
            {!address ? (
              <div>
                <p className="text-lg mb-2">You are not logged in</p>
                <p className="text-sm text-gray-400">Please connect your wallet to access the admin dashboard.</p>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-2">You are not authorized</p>
                <p className="text-sm text-gray-400">This area is restricted to administrators only.</p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-400 hover:from-emerald-700 hover:to-green-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Return to Home
            </button>
            
            {!address && (
              <p className="text-xs text-gray-400">
                Connect your wallet from the home page to get started
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-white">Campaign Moderation</h1>
            <p className="mt-2 text-gray-400">Manage campaign approvals and reviews</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center px-5 py-3 rounded-lg transition-all duration-200 ${
              isRefreshing 
                ? "bg-[#2a2a2a] text-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-emerald-600 to-green-400 hover:from-emerald-700 hover:to-green-500 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <svg 
              className={`w-5 h-5 mr-2 ${isRefreshing && "animate-spin"}`} 
              fill="none" 
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-800 rounded-lg">
            <div className="flex items-center text-red-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#3a3a3a]">
            <dt className="text-sm font-medium text-gray-400">Total Campaigns</dt>
            <dd className="mt-2 text-3xl font-semibold text-white">{campaignCount}</dd>
          </div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#3a3a3a]">
            <dt className="text-sm font-medium text-gray-400">Pending Reviews</dt>
            <dd className="mt-2 text-3xl font-semibold text-blue-400">{campaigns.length}</dd>
          </div>
          <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#3a3a3a]">
            <dt className="text-sm font-medium text-gray-400">Total Loaded</dt>
            <dd className="mt-2 text-3xl font-semibold text-white">{allCampaigns.length}</dd>
          </div>
        </div>

        {/* All Campaigns Table */}
        {allCampaigns.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">All Campaigns Overview</h2>
            <div className="bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#3a3a3a]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3a3a3a]">
                    {allCampaigns.map((campaign) => {
                      const statusCode = parseInt(campaign.status) as 0 | 1 | 2;
                      
                      const statusConfig: Record<0 | 1 | 2, { text: string; color: string }> = {
                        0: { text: "Pending", color: "bg-yellow-900/50 text-yellow-300 border-yellow-800" },
                        1: { text: "Approved", color: "bg-green-900/50 text-green-300 border-green-800" },
                        2: { text: "Rejected", color: "bg-red-900/50 text-red-300 border-red-800" }
                      };

                      const status = statusConfig[statusCode] || { text: "Unknown", color: "bg-gray-700 text-gray-300 border-gray-600" };

                      return (
                        <tr key={campaign.pId} className="hover:bg-[#3a3a3a]">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">#{campaign.pId}</td>
                          <td className="px-6 py-4 text-sm text-gray-200 max-w-xs truncate">{campaign.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                              {status.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 font-mono">{campaign.owner.substring(0, 10)}...</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pending Campaigns Section */}
        {campaigns.length === 0 ? (
          <div className="p-8 text-center bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] border-dashed">
            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-white">No pending campaigns</h3>
            <p className="mt-2 text-sm text-gray-400">All campaigns have been reviewed and processed.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Pending Campaign Reviews ({campaigns.length})</h2>
            {campaigns.map((campaign) => (
              <div key={campaign.pId} className="bg-[#2a2a2a] p-6 rounded-lg border border-[#3a3a3a]">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{campaign.title}</h3>
                      <span className="text-sm font-mono px-2 py-1 bg-[#3a3a3a] text-gray-300 rounded">
                        ID: {campaign.pId}
                      </span>
                    </div>
                    <p className="text-gray-300">{campaign.description}</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Target: {campaign.target} ETH</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-96 space-y-4">
                    <div className="space-y-2">
                      <button
                        onClick={() => handleApprove(campaign.pId)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-400 hover:from-emerald-700 hover:to-green-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve Campaign
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Rejection reason..."
                        className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        value={rejectionReasons[campaign.pId] || ""}
                        onChange={(e) => setRejectionReasons(prev => ({
                          ...prev,
                          [campaign.pId]: e.target.value
                        }))}
                      />
                      <button
                        onClick={() => handleReject(campaign.pId)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject Campaign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}