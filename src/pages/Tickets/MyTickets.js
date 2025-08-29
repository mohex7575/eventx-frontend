import React, { useState, useEffect } from 'react';
import { ticketAPI } from '../../services/api';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketAPI.getMyTickets();
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
        
        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">You don't have any tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{ticket.event?.title}</h3>
                    <p className="text-gray-600">{new Date(ticket.event?.date).toLocaleDateString()} • {ticket.event?.location}</p>
                    <p className="text-gray-600">Seat: {ticket.seatNumber}</p>
                    <p className="text-green-600 font-bold">${ticket.price}</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    {ticket.qrCode && (
                      <img 
                        src={ticket.qrCode} 
                        alt="QR Code" 
                        className="w-24 h-24 mx-auto"
                      />
                    )}
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Show this QR code at entry
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;