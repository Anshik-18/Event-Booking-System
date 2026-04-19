# Event Booking System API

A robust backend REST API built with Node.js, Express, and TypeScript. It features custom role-based access control (RBAC), an in-memory data store, rate limiting, and a simulated Kafka messaging queue for async background processing.

##  Getting Started

### Prerequisites

- Node.js 
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (uses `nodemon` & `ts-node`):
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   npm run start
   ```

##  Architecture

- **Clean Architecture Focus:** Controllers, Services, Middlewares, and Models are distinctly separated.
- **Data Storage:** Uses a robust in-memory datastore via `Map` (resets on server restart). This ensures synchronous, race-free ticket handling in Node.js.
- **Kafka / Async Jobs:** Originally integrated using KafkaJS. It includes a fallback so if a live Kafka broker (`localhost:9092`) is not found, it routes message data directly to the consumer internally, providing seamless development testing without external dependencies.
- **Rate-Limiting:** Secured with `express-rate-limit` blocking excessive requests (100 per 15 min per IP).

##  Authentication & RBAC

Authentication is simulated via headers. **Every request must include the following headers:**

- `x-user-id`: Any unique string identifying the caller (e.g., `user-123`).
- `x-user-role`: Must be either `organizer` or `customer`.

Trying to access a restricted route without the appropriate role will return a `403 Forbidden` response.

## 📡 API Endpoints

### Organizers Only (`x-user-role: organizer`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/events` | Create a new event |
| **PUT** | `/events/:id` | Update an existing event you own |
| **DELETE** | `/events/:id` | Delete an existing event you own |

### Customers Only (`x-user-role: customer`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/bookings` | Book tickets to an event |

### General Routes (Any valid role)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/events` | List all events |
| **GET** | `/events/:id` | Get details for an event |

##  Background Tasks (Notification System)

When an event is updated, or a booking is made, the system queues background tasks:
1. **Event Updates**: Automatically queries the database for all customers who booked the event and sequentially logs them, simulating individual notification dispatch alerts.
2. **Booking Confirmed**: Logs a mock email dispatch to the specific user regarding their new tickets.
