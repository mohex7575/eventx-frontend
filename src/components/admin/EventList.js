import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import './EventList.css';

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
      
      if (response.data.events) {
        setEvents(response.data.events);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setEvents(response.data);
        setTotalPages(1);
      }
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
      if (searchTerm !== '') {
        fetchEvents(1);
      }
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

  const handleGenerateQR = async (eventId) => {
    try {
      const response = await eventAPI.generateQRCode(eventId);
      alert(`QR Code generated successfully!\nData: ${response.data.qrCodeData}`);
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
      <div className="event-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h2 className="event-list-title">Event Management</h2>
        <Link to="/admin/events/create" className="create-event-btn">
          Create New Event
        </Link>
      </div>

      <div className="event-list-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="concert">Concert</option>
          <option value="sports">Sports</option>
          <option value="networking">Networking</option>
          <option value="other">Other</option>
        </select>

        <div className="sort-options">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="price">Price</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => fetchEvents(1)} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')}>
                Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('date')}>
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Location</th>
              <th>Category</th>
              <th onClick={() => handleSort('price')}>
                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Seats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-events">
                  No events found
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event._id} className="event-row">
                  <td className="event-title">
                    <Link to={`/event/${event._id}`} className="event-link">
                      {event.title}
                    </Link>
                  </td>
                  <td className="event-date">
                    {new Date(event.date).toLocaleDateString()}
                    <br />
                    <small>{event.time}</small>
                  </td>
                  <td className="event-location">{event.location}</td>
                  <td className="event-category">
                    <span className={`category-badge ${event.category}`}>
                      {event.category}
                    </span>
                  </td>
                  <td className="event-price">
                    ${event.price}
                  </td>
                  <td className="event-seats">
                    <div className="seats-info">
                      <span className="seats-available">{event.availableSeats}</span>
                      <span className="seats-total">/ {event.totalSeats}</span>
                    </div>
                    <div className="seats-progress">
                      <div 
                        className="seats-progress-bar"
                        style={{
                          width: `${((event.totalSeats - event.availableSeats) / event.totalSeats) * 100}%`
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="event-status">
                    <span className={`status-badge ${
                      new Date(event.date) < new Date() ? 'completed' :
                      event.availableSeats === 0 ? 'sold-out' :
                      'active'
                    }`}>
                      {new Date(event.date) < new Date() ? 'Completed' :
                       event.availableSeats === 0 ? 'Sold Out' : 'Active'}
                    </span>
                  </td>
                  <td className="event-actions">
                    <Link
                      to={`/admin/events/edit/${event._id}`}
                      className="action-btn edit-btn"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="action-btn delete-btn"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleGenerateQR(event._id)}
                      className="action-btn qr-btn"
                    >
                      QR Code
                    </button>
                    <Link
                      to={`/event/${event._id}`}
                      className="action-btn view-btn"
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
        <div className="pagination">
          <button
            onClick={() => fetchEvents(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchEvents(page)}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => fetchEvents(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList;