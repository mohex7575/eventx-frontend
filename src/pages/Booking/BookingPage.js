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
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventAPI.getEvent(id);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedSeat) {
      alert('Please select a seat first');
      return;
    }

    setLoading(true);
    try {
      const response = await ticketAPI.book({
        eventId: id,
        seatNumber: selectedSeat
      });
      
      alert('Booking successful!');
      navigate('/my-tickets');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div className="text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event Details */}
            <div>
              <h2 className="text-xl font-bold mb-4">Event Information</h2>
              <div className="space-y-2 mb-6">
                <p><strong>Event:</strong> {event.title}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Selected Seat:</strong> {selectedSeat}</p>
                <p><strong>Price:</strong> ${event.price}</p>
              </div>
            </div>

            {/* Seat Selection */}
            <div>
              <h2 className="text-xl font-bold mb-4">Select Your Seat</h2>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {event.seats && event.seats.map((seat) => (
                  <button
                    key={seat.seatNumber}
                    onClick={() => setSelectedSeat(seat.seatNumber)}
                    disabled={seat.isBooked}
                    className={`p-2 rounded text-center text-sm ${
                      seat.isBooked
                        ? 'bg-red-300 cursor-not-allowed'
                        : selectedSeat === seat.seatNumber
                        ? 'bg-green-300'
                        : 'bg-blue-100 hover:bg-blue-200'
                    }`}
                  >
                    {seat.seatNumber}
                  </button>
                ))}
              </div>

              {/* Payment Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Payment Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={loading || !selectedSeat}
                  className="w-full bg-green-500 text-white py-3 rounded-md mt-4 hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Pay $${event.price}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;