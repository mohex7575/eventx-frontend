import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/events', {
        params: {
          page,
          limit: 12,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          search: searchTerm || undefined
        }
      });
      
      // Handle both response formats (array or paginated object)
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
  };

  useEffect(() => {
    fetchEvents(1);
  }, [categoryFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        fetchEvents(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filterEvents = useCallback(() => {
    let filtered = events;

    // Client-side filtering for non-paginated responses
    if (searchTerm && totalPages === 1) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Client-side category filtering for non-paginated responses
    if (categoryFilter !== 'all' && totalPages === 1) {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, categoryFilter, totalPages]);

  useEffect(() => {
    if (totalPages === 1) {
      filterEvents();
    } else {
      setFilteredEvents(events);
    }
  }, [events, filterEvents, totalPages]);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleBookNow = (eventId, e) => {
    e.stopPropagation();
    navigate(`/booking/${eventId}`);
  };

  if (loading) {
    return (
      <div className="events-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-error">
        <p>{error}</p>
        <button onClick={() => fetchEvents(1)} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <p>Discover amazing events happening around you</p>
      </div>

      {/* Search and Filter Section */}
      <div className="events-filters">
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
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>No events found matching your criteria</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="event-card"
              onClick={() => handleEventClick(event._id)}
            >
              <div className="event-image">
                {event.image ? (
                  <img src={event.image} alt={event.title} />
                ) : (
                  <div className="event-image-placeholder">
                    {event.title?.charAt(0) || 'E'}
                  </div>
                )}
                <div className="event-category">{event.category}</div>
                {new Date(event.date) < new Date() && (
                  <div className="event-status-badge completed">Completed</div>
                )}
                {event.availableSeats === 0 && new Date(event.date) >= new Date() && (
                  <div className="event-status-badge sold-out">Sold Out</div>
                )}
              </div>

              <div className="event-content">
                <h3 className="event-name">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                
                <div className="event-details">
                  <div className="event-detail">
                    <span className="detail-icon">📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="event-detail">
                    <span className="detail-icon">⏰</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="event-detail">
                    <span className="detail-icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="event-footer">
                  <div className="event-capacity">
                    <span className="capacity-text">
                      {event.totalSeats - event.availableSeats}/{event.totalSeats} seats booked
                    </span>
                    <div className="capacity-bar">
                      <div 
                        className="capacity-progress"
                        style={{
                          width: `${((event.totalSeats - event.availableSeats) / event.totalSeats) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="event-actions">
                    <span className="event-price">
                      {event.price > 0 ? `$${event.price}` : 'Free'}
                    </span>
                    <button
                      onClick={(e) => handleBookNow(event._id, e)}
                      disabled={event.availableSeats === 0 || new Date(event.date) < new Date()}
                      className="book-btn"
                    >
                      {event.availableSeats === 0 ? 'Sold Out' : 
                       new Date(event.date) < new Date() ? 'Completed' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="events-pagination">
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

export default EventsPage;