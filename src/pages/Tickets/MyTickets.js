import React, { useState, useEffect } from 'react';
import { ticketAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketAPI.getMyTickets();
      const sortedTickets = response.data.sort(
        (a, b) => new Date(a.event.date) - new Date(b.event.date)
      );
      setTickets(sortedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (ticket) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 350;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.fillText(`Event: ${ticket.event.title}`, 10, 30);
    ctx.fillText(`Date: ${new Date(ticket.event.date).toLocaleDateString()}`, 10, 60);
    ctx.fillText(`Location: ${ticket.event.location}`, 10, 90);
    ctx.fillText(`Seat: ${ticket.seatNumber}`, 10, 120);
    ctx.fillText(`Price: $${ticket.price}`, 10, 150);

    const qrImage = new Image();
    qrImage.src = ticket.qrCode;
    qrImage.onload = () => {
      ctx.drawImage(qrImage, 50, 180, 200, 200);
      const link = document.createElement('a');
      link.download = `ticket_${ticket.event.title}_${ticket.seatNumber}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
  };

  if (loading) return <div className="text-center">Loading...</div>;

  // تصنيف التذاكر حسب الحالة
  const now = new Date();
  const categorizedTickets = {
    upcoming: tickets.filter(t => new Date(t.event.date) >= now && t.status === 'booked'),
    used: tickets.filter(t => t.status === 'checked-in'),
    expired: tickets.filter(t => new Date(t.event.date) < now && t.status === 'booked')
  };

  const tabTitles = {
    upcoming: 'Upcoming',
    used: 'Used',
    expired: 'Expired'
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Tickets</h1>

        {/* تبويبات الحالة */}
        <div className="flex space-x-4 mb-6">
          {Object.keys(tabTitles).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold rounded-lg transition ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tabTitles[tab]} ({categorizedTickets[tab].length})
            </button>
          ))}
        </div>

        {categorizedTickets[activeTab].length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No {tabTitles[activeTab]} tickets.</p>
            <Link
              to="/events"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {categorizedTickets[activeTab].map(ticket => (
              <div
                key={ticket._id}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{ticket.event?.title}</h3>
                  <p className="text-gray-600">
                    {new Date(ticket.event.date).toLocaleDateString()} • {ticket.event?.location}
                  </p>
                  <p className="text-gray-600">Seat: {ticket.seatNumber}</p>
                  <p className="text-green-600 font-bold">${ticket.price}</p>
                  <span
                    className={`inline-block px-3 py-1 mt-2 rounded-full text-sm font-semibold ${
                      activeTab === 'upcoming'
                        ? 'bg-green-100 text-green-800'
                        : activeTab === 'used'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tabTitles[activeTab]}
                  </span>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col items-center gap-3">
                  {ticket.qrCode && (
                    <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32" />
                  )}
                  <p className="text-center text-sm text-gray-500">
                    Show this QR code at entry
                  </p>
                  <button
                    onClick={() => handleDownload(ticket)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Download Ticket
                  </button>
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
