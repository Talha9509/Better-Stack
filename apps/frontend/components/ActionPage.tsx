"use client";

import React, { useEffect, useMemo } from 'react';
import { ArrowLeft, RefreshCw, Globe, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWebsiteStore } from '@/stores/websiteStore';
import { toast } from "sonner";
import { formatDate } from '@/lib/HelpfullFunction';

interface WebsiteDetailPageProps {
  websiteId: string;
}

export default function WebsiteDetailPage({ websiteId }: WebsiteDetailPageProps) {
  const router = useRouter();
  const { websites, fetchWebsites, refreshWebsites, loading } = useWebsiteStore();


  useEffect(() => {
    if (websites.length === 0) {
      fetchWebsites();
    }
  }, [fetchWebsites, websites.length]);

  const website = websites.find((w) => w.id === websiteId);


  const stats = useMemo(() => {
    if (!website || !website.ticks || website.ticks.length === 0) return null;

    const ticks = [...website.ticks].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const latestTick = ticks[0];
    const totalTicks = ticks.length;
    

    const upTicks = ticks.filter(t => t.status === "Up").length;
    const uptimePercentage = totalTicks > 0 ? ((upTicks / totalTicks) * 100).toFixed(2) : "0.00";


    const totalResponseTime = ticks.reduce((acc, curr) => acc + curr.response_time_ms, 0);
    const avgResponseTime = totalTicks > 0 ? Math.round(totalResponseTime / totalTicks) : 0;


    const timeline = ticks.slice(0, 20);

    return {
      latestStatus: latestTick.status,
      lastChecked: formatDate(latestTick.createdAt),
      responseTime: latestTick.response_time_ms,
      uptime: uptimePercentage,
      upCount: upTicks,
      downCount: ticks.length - upTicks,
      avgResponseTime,
      totalChecks: totalTicks,
      timeline
    };
  }, [website]);

  const handleRefresh = async () => {
    try {
      await refreshWebsites();
      toast.success("Data refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
    }
  };

  if (loading && !website) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center text-green-800">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading website details...</span>
        </div>
      </div>
    );
  }

  if (!website || !stats) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center text-gray-700 gap-4">
        <h2 className="text-xl font-medium">Website not found or no data available</h2>
        <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
      </div>
    );
  }

  const isUp = stats.latestStatus === 'Up';

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-green-100 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 border border-gray-200 hover:border-green-200 rounded-lg transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Website Header Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-green-100 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${isUp ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isUp ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 break-all">{website.url}</h1>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                  Visit Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className={`w-2 h-2 rounded-full ${isUp ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Current Status: <span className={`font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>{stats.latestStatus}</span></span>
                <span className="mx-2 text-gray-300">•</span>
                <span>Last checked: {stats.lastChecked}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Uptime */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-green-100 shadow-sm p-6">
            <div className="text-gray-500 text-sm mb-2 font-medium">Total Uptime</div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{stats.uptime}%</div>
          </div>

          {/* Response Time */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-green-100 shadow-sm p-6">
            <div className="text-gray-500 text-sm mb-2 font-medium">Latest Response</div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{stats.responseTime}ms</div>
          </div>

          {/* Up Count */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-green-100 shadow-sm p-6">
            <div className="text-gray-500 text-sm mb-2 font-medium">Total Up Checks</div>
            <div className="text-4xl font-bold text-green-600 mb-1">{stats.upCount}</div>
          </div>

          {/* Down Count */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-green-100 shadow-sm p-6">
            <div className="text-gray-500 text-sm mb-2 font-medium">Total Down Checks</div>
            <div className="text-4xl font-bold text-red-500 mb-1">{stats.downCount}</div>
          </div>
        </div>

        {/* Recent Status Checks */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-green-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Status History</h2>
              <p className="text-gray-500 text-sm">Most recent monitoring checks (Latest first)</p>
            </div>
            <div className="flex items-center gap-4 text-sm bg-white/50 px-3 py-1 rounded-full border border-green-50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                <span className="text-gray-600 font-medium">Up</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                <span className="text-gray-600 font-medium">Down</span>
              </div>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="mb-8">
            <div className="flex items-center gap-1 h-16 w-full overflow-hidden bg-white/40 p-1 rounded-lg border border-green-50">
              {stats.timeline.map((tick, index) => (
                <div
                  key={tick.id || index}
                  className={`flex-1 h-full min-w-[10px] rounded-md transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer flex items-center justify-center group relative ${
                    tick.status === 'Up' 
                      ? 'bg-green-400 hover:bg-green-500' 
                      : 'bg-red-400 hover:bg-red-500'
                  }`}
                >
                   {/* Tooltip */}
                   <div className="absolute bottom-full mb-3 hidden group-hover:block z-20 w-48 bg-white text-gray-800 text-xs p-3 rounded-lg border border-green-100 shadow-xl pointer-events-none animate-in fade-in slide-in-from-bottom-2">
                    <p className="font-bold mb-1 text-gray-900">{formatDate(tick.createdAt)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium ${tick.status === 'Up' ? 'text-green-600' : 'text-red-600'}`}>{tick.status}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-500">Response:</span>
                      <span className="font-medium text-gray-900">{tick.response_time_ms}ms</span>
                    </div>
                    {/* Tiny Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-white"></div>
                  </div>

                  {/* Icon */}
                  {tick.status === 'Up' ? (
                    <CheckCircle className="w-4 h-4 text-white/90" />
                  ) : (
                    <XCircle className="w-4 h-4 text-white/90" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Summary Footer */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-green-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.uptime}%</div>
              <div className="text-gray-500 text-sm font-medium">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.avgResponseTime}ms</div>
              <div className="text-gray-500 text-sm font-medium">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalChecks}</div>
              <div className="text-gray-500 text-sm font-medium">Total Checks Recorded</div>
            </div>
          </div>
        </div>

        <div className="text-center text-green-700/50 text-xs py-4 font-mono">
          ID: {websiteId}
        </div>
      </div>
    </div>
  );
}