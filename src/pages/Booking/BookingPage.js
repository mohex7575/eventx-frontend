import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI, ticketAPI } from '../../services/api';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventAPI.getEvent(id);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!selectedSeat) {
      alert('Please select a seat first');
      return;
    }

    setLoading(true);
    try {
      await ticketAPI.book({
        eventId: id,
        seatNumber: selectedSeat
      });
      
      alert('Booking successful!');
      navigate('/my-tickets');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div className="text-center text-gray-100 min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">{event.title}</h1>

          {/* Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Price:</strong> ${event.price}</p>
              <p><strong>Available Seats:</strong> {event.seats.filter(s => !s.isBooked).length}</p>
            </div>

            {/* Payment Section */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100"
                    />
                  </div>
                </div>
                <button
                  onClick={handleBooking}
                  disabled={loading || !selectedSeat}
                  className="w-full bg-green-500 text-white py-3 rounded-md mt-4 hover:bg-green-600 disabled:opacity-50 transition"
                >
                  {loading ? 'Processing...' : `Pay $${event.price}`}
                </button>
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-center">Select Your Seat</h2>
            <div className="grid grid-cols-5 gap-2 justify-center">
              {event.seats && event.seats.map((seat) => (
                <button
                  key={seat.seatNumber}
                  onClick={() => setSelectedSeat(seat.seatNumber)}
                  disabled={seat.isBooked}
                  className={`p-3 rounded-lg text-sm font-semibold ${
                    seat.isBooked
                      ? 'bg-red-700 cursor-not-allowed text-gray-400'
                      : selectedSeat === seat.seatNumber
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-blue-700 hover:bg-blue-600 text-white'
                  }`}
                >
                  {seat.seatNumber}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
