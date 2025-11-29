# API Documentation

Base URL: `http://localhost:3000/api`

## Games Endpoints

### GET /api/games

Get all games in the collection.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Super Mario Bros.",
      "platform": "NES",
      "year": 1985,
      "genre": "Platformer",
      "status": "owned",
      "coverImageUrl": "https://example.com/image.jpg",
      "notes": "Classic game",
      "condition": "good",
      "purchaseInfo": {
        "price": 25.99,
        "date": "2024-01-15T00:00:00.000Z",
        "location": "Retro Store"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### POST /api/games

Create a new game entry.

**Request Body:**

```json
{
  "title": "The Legend of Zelda",
  "platform": "NES",
  "year": 1986,
  "genre": "Adventure",
  "status": "owned",
  "coverImageUrl": "https://example.com/zelda.jpg",
  "notes": "Gold cartridge edition",
  "condition": "excellent",
  "purchaseInfo": {
    "price": 45.00,
    "date": "2024-01-20",
    "location": "eBay"
  }
}
```

**Required Fields:**
- `title` (string)
- `platform` (string)
- `status` ("owned" | "wishlist")

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "The Legend of Zelda",
    // ... other fields
  }
}
```

### GET /api/games/:id

Get a specific game by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Super Mario Bros.",
    // ... other fields
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Game not found"
}
```

### PUT /api/games/:id

Update a game by ID.

**Request Body:** (same as POST, all fields optional)

```json
{
  "title": "Super Mario Bros. (Updated)",
  "condition": "mint"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    // ... updated fields
  }
}
```

### DELETE /api/games/:id

Delete a game by ID.

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

## Data Models

### Game

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Game title |
| platform | string | Yes | Gaming platform (e.g., NES, SNES, PS1) |
| year | number | No | Release year (1970-current year) |
| genre | string | No | Game genre |
| status | enum | Yes | "owned" or "wishlist" |
| coverImageUrl | string | No | URL to cover image |
| notes | string | No | Personal notes |
| condition | enum | No | "mint", "excellent", "good", "fair", or "poor" |
| purchaseInfo | object | No | Purchase details (see below) |

### Purchase Info

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| price | number | No | Purchase price |
| date | date | No | Purchase date |
| location | string | No | Where it was purchased |

## Error Responses

All endpoints may return error responses:

**400 Bad Request:**

```json
{
  "success": false,
  "error": "Validation error message"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "error": "Game not found"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "error": "Failed to [action]"
}
```

