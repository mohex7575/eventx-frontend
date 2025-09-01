import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/events");
      console.log("Events response:", response.data);

      // Make sure we get an array
      const eventsArray = Array.isArray(response.data)
        ? response.data
        : response.data.events || [];

      const sortedEvents = eventsArray.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setEvents(sortedEvents);
    } catch (err) {
      setError("Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Latest Events</h1>

      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="mt-2">{event.description}</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
