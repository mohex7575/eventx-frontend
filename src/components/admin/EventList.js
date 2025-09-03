import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../../services/api';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchEvents = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await eventAPI.getEvents({
        page,
        limit: 10,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined,
        sortBy,
        sortOrder
      });

      setEvents(response.data.events || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      setError('Failed to load events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchEvents(1);
  }, [fetchEvents]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchEvents]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.deleteEvent(id);
        fetchEvents(currentPage);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleGenerateQR = async (id) => {
    try {
      const response = await eventAPI.generateQRCode(id);
      alert(`QR Code generated!\nData: ${response.data.qrCodeData}`);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-100">
        <div className="loader mb-4"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-gray-100">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Event Management</h2>
        <Link
          to="/admin/events/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Create New Event
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="absolute right-3 top-2 text-gray-400">🔍</span>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Categories</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="concert">Concert</option>
          <option value="sports">Sports</option>
          <option value="networking">Networking</option>
          <option value="other">Other</option>
        </select>

        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="price">Price</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-1 border border-gray-600 rounded-lg bg-gray-700 text-gray-100"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white px-4 py-2 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => fetchEvents(1)} className="text-blue-300 font-semibold">
            Retry
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 shadow rounded-lg">
          <thead className="bg-gray-800 text-left text-gray-100">
            <tr>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('title')}>
                Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('date')}>
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('price')}>
                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2">Seats</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center px-4 py-6 text-gray-300">
                  No events found
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event._id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="px-4 py-2">
                    <Link to={`/event/${event._id}`} className="text-blue-400 hover:underline">
                      {event.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(event.date).toLocaleDateString()} <br />
                    <small>{event.time}</small>
                  </td>
                  <td className="px-4 py-2">{event.location}</td>
                  <td className="px-4 py-2">
                    <span className="bg-blue-700 text-blue-200 px-2 py-1 rounded-full text-xs">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-4 py-2">${event.price}</td>
                  <td className="px-4 py-2">
                    {event.availableSeats} / {event.totalSeats}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(event.date) < new Date()
                      ? 'Completed'
                      : event.availableSeats === 0
                      ? 'Sold Out'
                      : 'Active'}
                  </td>
                  <td className="px-4 py-2 flex flex-wrap gap-1">
                    <Link
                      to={`/admin/events/edit/${event._id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleGenerateQR(event._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      QR Code
                    </button>
                    <Link
                      to={`/event/${event._id}`}
                      className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600 text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          <button
            onClick={() => fetchEvents(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 text-gray-100"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchEvents(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => fetchEvents(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 text-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList;
