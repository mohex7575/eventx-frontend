import React, { useState, useEffect } from 'react';
import { ticketAPI } from '../../services/api';
import { Link } from 'react-router-dom';

// مكون صغير لعرض بطاقة التذكرة
const TicketCard = ({ ticket, handleDownload }) => {
  const eventDate = new Date(ticket.event.date);
  const now = new Date();
  const status =
    eventDate < now
      ? ticket.status === 'checked-in'
        ? 'Used'
        : 'Expired'
      : 'Upcoming';

  const statusColor =
    status === 'Upcoming'
      ? 'bg-green-100 text-green-800'
      : status === 'Used'
      ? 'bg-orange-100 text-orange-800'
      : 'bg-red-100 text-red-800';

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <h3 className="text-xl font-bold">{ticket.event?.title}</h3>
        <p className="text-gray-600">
          {eventDate.toLocaleDateString()} • {ticket.event?.location}
        </p>
        <p className="text-gray-600">Seat: {ticket.seatNumber}</p>
        <p className="text-green-600 font-bold">${ticket.price}</p>
        <span
          className={`inline-block px-2 py-1 mt-2 rounded-full text-sm font-semibold ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 md:mt-0 flex flex-col items-center gap-2">
        {ticket.qrCode && (
          <img src={ticket.qrCode} alt="QR Code" className="w-24 h-24" />
        )}
        <p className="text-center text-sm text-gray-500">
          Show this QR code at entry
        </p>
        <button
          onClick={() => handleDownload(ticket)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2"
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
};

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketAPI.getMyTickets();
      // ترتيب حسب التاريخ: الأحداث القادمة أولاً
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
    ctx.fillText(
      `Date: ${new Date(ticket.event.date).toLocaleDateString()}`,
      10,
      60
    );
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

  // فصل التذاكر إلى القادمة و الماضية
  const now = new Date();
  const upcomingTickets = tickets.filter(
    (t) => t.status === 'booked' && new Date(t.event.date) >= now
  );
  const pastTickets = tickets.filter(
    (t) => t.status === 'checked-in' || new Date(t.event.date) < now
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You don't have any tickets yet.</p>
            <Link
              to="/events"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <>
            {upcomingTickets.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Tickets</h2>
                <div className="space-y-4">
                  {upcomingTickets.map((ticket) => (
                    <TicketCard
                      key={ticket._id}
                      ticket={ticket}
                      handleDownload={handleDownload}
                    />
                  ))}
                </div>
              </div>
            )}

            {pastTickets.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Past / Used Tickets</h2>
                <div className="space-y-4">
                  {pastTickets.map((ticket) => (
                    <TicketCard
                      key={ticket._id}
                      ticket={ticket}
                      handleDownload={handleDownload}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
