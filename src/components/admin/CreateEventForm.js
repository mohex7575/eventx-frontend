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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Event title is required';
    if (!formData.description.trim()) return 'Event description is required';
    if (!formData.date) return 'Event date is required';
    if (!formData.time) return 'Event time is required';
    if (!formData.location.trim()) return 'Event location is required';
    if (!formData.totalSeats || formData.totalSeats < 1) return 'Total seats must be at least 1';
    if (formData.price === '' || formData.price < 0) return 'Price must be a non-negative number';
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime <= new Date()) return 'Event date and time must be in the future';
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
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
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
    } catch (error) {
      console.error(error);
      const errorInfo = handleApiError(error);
      setError(errorInfo.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Create New Event</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <inputField label="Event Title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter event title" />
          <inputField label="Date" name="date" type="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
          <inputField label="Time" name="time" type="time" value={formData.time} onChange={handleChange} />
          <inputField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Enter event location" />
          <inputField label="Total Seats" name="totalSeats" type="number" value={formData.totalSeats} onChange={handleChange} min="1" placeholder="Number of seats" />
          <inputField label="Price ($)" name="price" type="number" value={formData.price} onChange={handleChange} min="0" step="0.01" placeholder="0.00" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your event..."
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 transition"
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
            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

// Component for input field to avoid repetition
const inputField = ({ label, name, type = 'text', value, onChange, placeholder, min, step }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label} *</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      step={step}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
);

export default CreateEventForm;
