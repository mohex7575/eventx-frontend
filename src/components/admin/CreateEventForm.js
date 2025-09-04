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
    category: 'conference',
    image: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(''); // Clear error while typing
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Event title is required';
    if (!formData.description.trim()) return 'Event description is required';
    if (!formData.date) return 'Event date is required';
    if (!formData.time) return 'Event time is required';
    if (!formData.location.trim()) return 'Event location is required';
    if (!formData.totalSeats || formData.totalSeats < 1) return 'Total seats must be at least 1';
    if (formData.price === '' || formData.price < 0) return 'Price must be a non-negative number';

    // Combine date + time and check if in the future
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (isNaN(eventDateTime.getTime())) return 'Invalid date or time';
    if (eventDateTime <= new Date()) return 'Event date and time must be in the future';

    // Validate category
    const allowedCategories = ['conference', 'workshop', 'concert', 'webinar', 'sports', 'networking', 'other'];
    if (!allowedCategories.includes(formData.category.toLowerCase())) {
      return 'Invalid category selected';
    }

    return null;
  };

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
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,        // Date only
        time: formData.time,        // Time as string
        location: formData.location.trim(),
        totalSeats: parseInt(formData.totalSeats, 10),
        price: parseFloat(formData.price),
        category: formData.category.toLowerCase(),
        image: formData.image.trim() || ''
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
        category: 'conference',
        image: ''
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
          <div>
            <label className="block text-sm font-medium mb-1">Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time *</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter event location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Total Seats *</label>
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              placeholder="Number of seats"
            />
          </div>

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
              placeholder="0.00"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Optional image URL"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Describe your event..."
          />
        </div>

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
                category: 'conference',
                image: ''
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
