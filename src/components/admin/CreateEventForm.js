import React, { useState } from 'react';
import { eventAPI, handleApiError } from '../../services/api';

const CreateEventForm = ({ onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    totalSeats: '',
    price: '',
    category: 'conference'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  // Client-side validation
  const validateForm = () => {
    if (!formData.title.trim()) return 'Event title is required';
    if (!formData.description.trim()) return 'Event description is required';
    if (!formData.date) return 'Event date is required';
    if (!formData.time) return 'Event time is required';
    if (!formData.location.trim()) return 'Event location is required';
    if (!formData.totalSeats || parseInt(formData.totalSeats, 10) < 1) return 'Total seats must be at least 1';
    if (formData.price === '' || parseFloat(formData.price) < 0) return 'Price must be a non-negative number';

    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime <= new Date()) return 'Event date and time must be in the future';

    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert date+time to ISO
      const isoDate = new Date(`${formData.date}T${formData.time}`).toISOString();

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: isoDate,
        time: formData.time,
        location: formData.location.trim(),
        totalSeats: parseInt(formData.totalSeats, 10),
        availableSeats: parseInt(formData.totalSeats, 10),
        price: parseFloat(formData.price),
        category: formData.category.toLowerCase()
      };

      const response = await eventAPI.createEvent(eventData);

      alert('Event created successfully!');

      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        totalSeats: '',
        price: '',
        category: 'conference'
      });

      if (onEventCreated) onEventCreated(response.data);

    } catch (err) {
      console.error('Error creating event:', err);
      const errorInfo = handleApiError(err);
      setError(errorInfo.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 shadow rounded-lg p-6 mb-6 text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Create New Event</h2>

      {error && (
        <div className="bg-red-600 border border-red-400 text-white px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              placeholder="Enter event title"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Time *</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              placeholder="Enter event location"
            />
          </div>

          {/* Total Seats */}
          <div>
            <label className="block text-sm font-medium mb-1">Total Seats *</label>
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              required
              placeholder="Number of seats"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="0"
              step="0.01"
              required
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="concert">Concert</option>
            <option value="webinar">Webinar</option>
            <option value="sports">Sports</option>
            <option value="networking">Networking</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            placeholder="Describe your event..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                totalSeats: '',
                price: '',
                category: 'conference'
              });
              setError('');
            }}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;
