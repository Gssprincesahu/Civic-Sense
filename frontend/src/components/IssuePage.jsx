import React, { useState, useEffect } from 'react';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPriority, setSelectedPriority] = useState('All Priority');
  const [sortBy, setSortBy] = useState('Latest');
  const [selectedZone, setSelectedZone] = useState('All Zones');

  const categories = ['All Categories', 'infrastructure', 'environment', 'safety', 'public-services', 'other'];
  const priorities = ['All Priority', 'low', 'medium', 'high', 'critical'];
  const sortOptions = ['Latest', 'Oldest', 'High Priority First', 'Low Priority First'];

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/issues');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIssues(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch issues');
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const deleteIssue = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/issues/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIssues(issues.filter(issue => issue._id !== id));
        alert('Issue deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete issue');
      }
    } catch (err) {
      console.error('Error deleting issue:', err);
      alert('Unable to delete issue');
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || issue.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All Priority' || issue.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    
    switch (sortBy) {
      case 'Latest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'Oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'High Priority First':
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'Low Priority First':
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#002147] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F4C430] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#002147] p-8">
        <div className="max-w-2xl mx-auto bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchIssues}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#002147] p-8">
      <h1 className="text-3xl font-bold text-[#F4C430] text-center mb-4">
        Community Issues
      </h1>
      <p className="text-center text-gray-300 mb-8">
        Browse and search reported issues in your community. Total Issues: {issues.length}
      </p>

      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C430] bg-white"
        />

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C430] bg-white"
        >
          {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
        </select>

        <select
          value={selectedPriority}
          onChange={e => setSelectedPriority(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C430] bg-white"
        >
          {priorities.map((pri, idx) => <option key={idx} value={pri}>{pri}</option>)}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C430] bg-white"
        >
          {sortOptions.map((option, idx) => <option key={idx} value={option}>{option}</option>)}
        </select>

        <button
          onClick={fetchIssues}
          className="bg-[#10B981] text-white px-6 py-3 rounded-lg hover:bg-[#059669] transition"
        >
          Refresh
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {sortedIssues.length === 0 ? (
          <div className="text-center py-12 bg-white/95 rounded-lg shadow">
            <p className="text-gray-500 text-lg">No issues found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedIssues.map((issue) => (
              <div key={issue._id} className="bg-white/95 border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image Section */}
                  {issue.image && issue.image !== 'https://via.placeholder.com/400x300?text=No+Image' && (
                    <div className="md:w-1/3">
                      <img 
                        src={issue.image} 
                        alt={issue.title}
                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Content Section */}
                  <div className={issue.image && issue.image !== 'https://via.placeholder.com/400x300?text=No+Image' ? 'md:w-2/3' : 'w-full'}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-semibold text-gray-800">{issue.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{issue.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <p><strong>🏷️ Category:</strong> {issue.category}</p>
                      {issue.address && <p><strong>📮 Address:</strong> {issue.address}</p>}
                      {issue.city && <p><strong>🏙️ City:</strong> {issue.city}</p>}
                      {issue.state && <p><strong>🗺️ State:</strong> {issue.state}</p>}
                      {issue.zipCode && <p><strong>📫 Zip Code:</strong> {issue.zipCode}</p>}
                    </div>

                    {issue.coordinates && (
                      <p className="text-xs text-gray-500 mb-3">
                        Coordinates: {issue.coordinates.lat.toFixed(6)}, {issue.coordinates.lng.toFixed(6)}
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Reported on {formatDate(issue.createdAt)}
                      </p>
                      <button
                        onClick={() => deleteIssue(issue._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
                      >
                        Delete
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
};

export default IssuesPage;