import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { StoredCandidate, StoredVideo } from '../types';
import { Search, Users, Calendar, BookOpen, LogOut, ChevronLeft, ChevronRight, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface CandidateWithVideos extends StoredCandidate {
  videos: StoredVideo[];
}

const ITEMS_PER_PAGE = 5;

export function AdminDashboard() {
  const [candidates, setCandidates] = useState<CandidateWithVideos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    departments: {} as Record<string, number>
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (candidatesError) throw candidatesError;

      const candidatesWithVideos: CandidateWithVideos[] = [];

      for (const candidate of candidatesData) {
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select('*')
          .eq('candidate_id', candidate.id);

        if (videosError) throw videosError;

        candidatesWithVideos.push({
          ...candidate,
          videos: videosData || []
        });
      }

      setCandidates(candidatesWithVideos);
      calculateStats(candidatesWithVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: CandidateWithVideos[]) => {
    const today = new Date().toISOString().split('T')[0];
    const departments = data.reduce((acc, candidate) => {
      acc[candidate.department] = (acc[candidate.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({
      total: data.length,
      today: data.filter(c => c.created_at.startsWith(today)).length,
      departments
    });
  };

  const filteredCandidates = candidates
    .filter(candidate => {
      const searchFields = [
        candidate.full_name,
        candidate.college_name,
        candidate.department,
        new Date(candidate.date_of_birth).toLocaleDateString(),
        new Date(candidate.created_at).toLocaleString()
      ].map(field => field.toLowerCase());

      const matchesSearch = searchFields.some(field => 
        field.includes(searchTerm.toLowerCase())
      );
      
      const matchesDepartment = 
        selectedDepartment === 'all' || 
        candidate.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin';
  };

  const toggleCandidateVideos = (candidateId: string) => {
    setExpandedCandidate(expandedCandidate === candidateId ? null : candidateId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex h-full">
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                <div className="container mx-auto px-6 py-8">
                  <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-300 rounded"></div>
                      ))}
                    </div>
                    <div className="h-96 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 shadow-md">
            <img
              src="https://gmyipnwiqnnxtouvmxbf.supabase.co/storage/v1/object/public/logo//posspole%20logo%20.png"
              alt="Posspole Logo"
              className="h-12 w-auto"
            />
          </div>
          
          <nav className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 space-y-6">
              <div>
                <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Overview
                </h2>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center text-gray-700 px-3 py-2 rounded-lg bg-gray-100">
                    <Users className="h-5 w-5" />
                    <span className="ml-2">Total Candidates: {stats.total}</span>
                  </div>
                  <div className="flex items-center text-gray-700 px-3 py-2">
                    <Calendar className="h-5 w-5" />
                    <span className="ml-2">Today's Interviews: {stats.today}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Departments
                </h2>
                <div className="mt-3 space-y-3">
                  {Object.entries(stats.departments).map(([dept, count]) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        selectedDepartment === dept
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{dept}</span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        selectedDepartment === dept
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Departments</option>
                    {Object.keys(stats.departments).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {paginatedCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {candidate.full_name}
                          </h2>
                          <div className="mt-1 grid grid-cols-2 gap-x-6 text-sm text-gray-600">
                            <p className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-2" />
                              {candidate.college_name}
                            </p>
                            <p className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {candidate.department}
                            </p>
                            <p className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(candidate.date_of_birth).toLocaleDateString()}
                            </p>
                            <p className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(candidate.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleCandidateVideos(candidate.id)}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <span>{candidate.videos.length} Responses</span>
                          {expandedCandidate === candidate.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {expandedCandidate === candidate.id && (
                        <div className="mt-6 animate-fadeIn">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Responses</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {candidate.videos.map((video) => (
                              <div
                                key={video.id}
                                className="bg-gray-50 rounded-lg p-4"
                              >
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Question {video.question_id}
                                </h4>
                                <video
                                  controls
                                  className="w-full rounded-lg shadow-sm"
                                  src={video.video_url}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                          {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * ITEMS_PER_PAGE, filteredCandidates.length)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{filteredCandidates.length}</span>{' '}
                        results
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}