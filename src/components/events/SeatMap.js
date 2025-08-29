import React from 'react';

const SeatMap = ({ event, onSeatSelect, selectedSeat }) => {
  if (!event.seats || event.seats.length === 0) {
    return <div>No seating information available</div>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Seating Map</h3>
      <div className="grid grid-cols-10 gap-2">
        {event.seats.map((seat) => (
          <button
            key={seat.seatNumber}
            onClick={() => onSeatSelect(seat.seatNumber)}
            disabled={seat.isBooked}
            className={`p-2 rounded text-center text-sm ${
              seat.isBooked
                ? 'bg-red-300 cursor-not-allowed'
                : selectedSeat === seat.seatNumber
                ? 'bg-green-300'
                : 'bg-white hover:bg-gray-200'
            }`}
            title={seat.isBooked ? 'Already booked' : 'Available'}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border mr-2"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-300 mr-2"></div>
          <span className="text-sm">Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-300 mr-2"></div>
          <span className="text-sm">Selected</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;