import React from 'react';

const SeatMap = ({ event, onSeatSelect, selectedSeat }) => {
  if (!event.seats || event.seats.length === 0) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <h3 className="text-lg font-bold mb-2">Seating Map</h3>
        <p className="text-gray-600">No seating information available for this event</p>
      </div>
    );
  }

  // Group seats by row for better organization
  const seatsByRow = {};
  event.seats.forEach(seat => {
    const row = seat.seatNumber.replace(/[0-9]/g, '');
    if (!seatsByRow[row]) {
      seatsByRow[row] = [];
    }
    seatsByRow[row].push(seat);
  });

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Seating Map</h3>
      
      {/* Screen representation */}
      <div className="bg-gray-200 py-3 mb-6 text-center rounded">
        <span className="font-semibold text-gray-700">STAGE / SCREEN</span>
      </div>

      {/* Seating grid */}
      <div className="space-y-4">
        {sortedRows.map((row) => (
          <div key={row} className="flex items-center justify-center space-x-2">
            <span className="w-6 text-sm font-bold text-gray-600">{row}</span>
            <div className="flex space-x-1">
              {seatsByRow[row]
                .sort((a, b) => {
                  const numA = parseInt(a.seatNumber.replace(row, ''));
                  const numB = parseInt(b.seatNumber.replace(row, ''));
                  return numA - numB;
                })
                .map((seat) => (
                  <button
                    key={seat.seatNumber}
                    onClick={() => onSeatSelect(seat.seatNumber)}
                    disabled={seat.isBooked}
                    className={`
                      w-8 h-8 rounded text-xs font-medium transition-all duration-200
                      ${seat.isBooked
                        ? 'bg-red-400 cursor-not-allowed text-white'
                        : selectedSeat === seat.seatNumber
                        ? 'bg-green-500 text-white transform scale-110'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200 hover:scale-105'
                      }
                    `}
                    title={seat.isBooked ? `Seat ${seat.seatNumber} - Already booked` : `Seat ${seat.seatNumber} - Available`}
                  >
                    {seat.seatNumber.replace(row, '')}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold mb-3 text-gray-700">Legend</h4>
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="text-xs text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-xs text-gray-600">Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-xs text-gray-600">Stage</span>
          </div>
        </div>
      </div>

      {/* Selected seat info */}
      {selectedSeat && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 font-medium">
            Selected: <span className="font-bold">{selectedSeat}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SeatMap;