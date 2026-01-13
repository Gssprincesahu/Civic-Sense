import React, { useState } from 'react';

const IssuesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPriority, setSelectedPriority] = useState('All Priority');
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [sortBy, setSortBy] = useState('Latest');

  const categories = [
    'All Categories', 'Education and Infrastructure', 'Electricity and Power',
    'Environment and Cleanliness', 'Healthcare and Safety', 'Others',
    'Public Services', 'Road and Transportation', 'Security and Crime',
    'Technology and Digital', 'Water and Sanitation'
  ];

  const priorities = ['All Priority', 'LOW', 'MEDIUM', 'HIGH'];
  const zones = [
    'All Zones', 'Hospital Area', 'MMMUT Campus',
    'Main Market', 'Railway Station',
    'Residential Zone', 'Residential Zone 2', 'Park'
  ];
  const sortOptions = ['Latest', 'Most Upvoted', 'Most Discussed', 'Alphabetical'];

  const dummyIssues = [
    // Example dummy data structure
    {
      title: 'broken Hostel',
      description: 'Hostel ceilings are falling',
      location: 'Raman Hostel, MMMUT',
      category: 'Education and Infrastructure',
      priority: 'HIGH',
      zone: 'Hospital Area',
      reportedBy: 'Abhi',
      timestamp: '4 hours ago',
    },
    {
    title: 'Broken Hostel',
    description: 'Hostel ceilings are falling and unsafe for residents.',
    location: 'Raman Hostel, MMMUT',
    category: 'Education and Infrastructure',
    priority: 'HIGH',
    zone: 'Hospital Area',
    reportedBy: 'Abhi',
    timestamp: '4 hours ago',
    upvotes: 12,
    comments: 5,
  },
  {
    title: 'Streetlight Not Working',
    description: 'Streetlights near the Main Market are not functioning at night.',
    location: 'Main Market, Sector 4',
    category: 'Public Services',
    priority: 'MEDIUM',
    zone: 'Main Market',
    reportedBy: 'Neha',
    timestamp: '1 day ago',
    upvotes: 8,
    comments: 2,
  },
  {
    title: 'Water Leakage',
    description: 'Water pipe leakage causing wet roads near IIT Campus.',
    location: 'Near MMMUT Campus Gate',
    category: 'Water and Sanitation',
    priority: 'LOW',
    zone: 'MMMUT Campus',
    reportedBy: 'Rahul',
    timestamp: '2 days ago',
    upvotes: 5,
    comments: 1,
  },
  {
    title: 'Illegal Dumping',
    description: 'Garbage dumped in residential zone creating bad smell.',
    location: 'Residential Zone 1',
    category: 'Environment and Cleanliness',
    priority: 'HIGH',
    zone: 'Residential Zone 1',
    reportedBy: 'Priya',
    timestamp: '3 hours ago',
    upvotes: 15,
    comments: 6,
  },
  {
    title: 'Road Potholes',
    description: 'Several potholes causing traffic delays near Tech Park.',
    location: ' Park Road',
    category: 'Road and Transportation',
    priority: 'MEDIUM',
    zone: ' Park',
    reportedBy: 'Amit',
    timestamp: '5 hours ago',
    upvotes: 10,
    comments: 3,
  },
    // Add more issue objects as needed
  ];

  const filteredIssues = dummyIssues
    .filter(issue =>
      (selectedCategory === 'All Categories' || issue.category === selectedCategory) &&
      (selectedPriority === 'All Priority' || issue.priority === selectedPriority) &&
      (selectedZone === 'All Zones' || issue.zone === selectedZone) &&
      (issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
       issue.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'Latest') return 0; // Assume data already latest first
      if (sortBy === 'Most Upvoted') return b.upvotes - a.upvotes;
      if (sortBy === 'Most Discussed') return b.comments - a.comments;
      if (sortBy === 'Alphabetical') return a.title.localeCompare(b.title);
      return 0;
    });

  return (
     <div className="min-h-screen bg-green-50 p-8">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-4">
        Community Issues
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Browse and search reported issues in your community.
      </p>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
        </select>

        <select
          value={selectedPriority}
          onChange={e => setSelectedPriority(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {priorities.map((pri, idx) => <option key={idx} value={pri}>{pri}</option>)}
        </select>

        <select
          value={selectedZone}
          onChange={e => setSelectedZone(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {zones.map((zone, idx) => <option key={idx} value={zone}>{zone}</option>)}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {sortOptions.map((option, idx) => <option key={idx} value={option}>{option}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filteredIssues.map((issue, idx) => (
          <div key={idx} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{issue.title}</h3>
            <p>{issue.description}</p>
            <p className="text-sm text-gray-500">Location: {issue.location}</p>
            <p className="text-sm italic">Category: {issue.category}</p>
            <p className="text-sm text-red-500 font-semibold">Priority: {issue.priority}</p>
            <p className="text-sm text-gray-500">Zone: {issue.zone}</p>
            <p className="text-sm text-gray-400">Reported by {issue.reportedBy} - {issue.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssuesPage;