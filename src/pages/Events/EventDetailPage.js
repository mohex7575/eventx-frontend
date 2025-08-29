import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import SeatMap from '../../components/events/SeatMap';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await eventAPI.getEvent(id);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]); // فقط id dependency

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeat(seatNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.966-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 mr-2"
            >
              Try Again
            </button>
            <Link
              to="/events"
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Event Not Found</h2>
            <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
            <Link
              to="/events"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Browse All Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/events" className="hover:text-blue-500">Events</Link>
            </li>
            <li className="before:content-['/'] before:mx-2"></li>
            <li className="text-gray-800">{event.title}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Event Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-blue-100">{event.description}</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Event Details */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Event Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span><strong>Time:</strong> {event.time}</span>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span><strong>Location:</strong> {event.location}</span>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <span><strong>Category:</strong> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{event.category}</span></span>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span><strong>Price:</strong> <span className="text-green-600 font-bold">${event.price}</span></span>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span><strong>Available Seats:</strong> 
                      <span className={`font-bold ml-1 ${event.availableSeats > 10 ? 'text-green-600' : event.availableSeats > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                        {event.availableSeats} / {event.totalSeats}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Seat Map */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Select Your Seat</h2>
                <SeatMap 
                  event={event} 
                  onSeatSelect={handleSeatSelect}
                  selectedSeat={selectedSeat}
                />
              </div>
            </div>

            {/* Booking Section */}
            {selectedSeat && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-green-800 mb-2">Selected Seat: {selectedSeat}</h3>
                    <p className="text-green-600">Total Amount: <span className="font-bold">${event.price}</span></p>
                    <p className="text-sm text-green-600 mt-1">Your seat will be reserved for 10 minutes</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <Link
                      to={`/booking/${event._id}`}
                      state={{ seat: selectedSeat }}
                      className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 font-semibold transition duration-200 inline-block"
                    >
                      Continue to Booking
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Additional Information</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600">
                  {event.description || 'No additional information available for this event.'}
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <h4 className="font-bold text-yellow-800 mb-2">📝 Important Notes:</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Please arrive at least 30 minutes before the event starts</li>
                    <li>• Bring your ID and ticket confirmation</li>
                    <li>• Seats are allocated on a first-come, first-served basis</li>
                    <li>• No refunds unless the event is cancelled</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;