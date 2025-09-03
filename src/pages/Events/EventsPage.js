import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/events');
      let eventsData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.events)
        ? response.data.events
        : [];
      eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(eventsData);
    } catch (error) {
      setError('Failed to load events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
        <button onClick={fetchEvents} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="events-page dark">
      <div className="events-header">
        <h1>🎉 Discover Amazing Events</h1>
        <p>Find and book your next unforgettable experience</p>
      </div>

      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search events by name, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
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
        </div>

        <div className="results-info">
          <p>Found {filteredEvents.length} event(s)</p>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">🔍</div>
            <h3>No events found</h3>
            <p>Try adjusting your search criteria or browse all categories</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}
              className="clear-filters-btn"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="event-card dark-card"
              onClick={() => handleEventClick(event._id)}
            >
              <div className="event-image">
                {event.image ? (
                  <img src={event.image} alt={event.title} />
                ) : (
                  <div className="event-image-placeholder">
                    <span className="placeholder-icon">🎭</span>
                  </div>
                )}
                <div className="event-category-badge">{event.category}</div>
                {new Date(event.date) < new Date() && (
                  <div className="event-status-badge completed">Completed</div>
                )}
                {event.availableSeats === 0 &&
                  new Date(event.date) >= new Date() && (
                    <div className="event-status-badge sold-out">Sold Out</div>
                  )}
              </div>

              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
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
                      {event.availableSeats} seats available
                    </span>
                    <div className="capacity-bar">
                      <div
                        className="capacity-progress"
                        style={{
                          width: `${
                            ((event.totalSeats - event.availableSeats) /
                              event.totalSeats) *
                            100
                          }%`,
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
                      disabled={
                        event.availableSeats === 0 ||
                        new Date(event.date) < new Date()
                      }
                      className="book-btn dark-btn"
                    >
                      {event.availableSeats === 0
                        ? 'Sold Out'
                        : new Date(event.date) < new Date()
                        ? 'Completed'
                        : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPage;
