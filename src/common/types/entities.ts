/**
 * Core entity types for AliasCore Mobile
 * These types mirror the data structures defined in the product specification
 */

/**
 * User entity
 * Represents an authenticated user with their profile information
 */
export interface User {
  id: string;
  email: string;
  displayName: string; // 3-30 characters, alphanumeric + spaces + . - '
  avatarUrl: string | null;
  domains: string[]; // Array of domain IDs (max 10 per user)
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * DomainProfile entity
 * Represents a user's profile for a specific gaming domain (e.g., Chess, Esports)
 */
export interface DomainProfile {
  id: string;
  userId: string;
  domainKey: string; // Unique identifier for the domain (e.g., 'chess', 'valorant')
  domainName: string; // Display name (e.g., 'Chess', 'Valorant')
  domainIcon: string; // URL or asset path to domain icon
  primaryPlatform: string; // Platform name (e.g., 'Chess.com', 'Riot Games')
  platformUsername: string; // User's username on that platform
  peakRating: number | null; // Highest rating achieved
  currentRating: number | null; // Current rating
  gamesPlayed: number | null; // Total games played
  rankTier: string | null; // Rank/tier name (e.g., 'Diamond', 'Master')
  shareSlug: string; // Unique slug for public share URLs
  lastUpdated: string; // ISO 8601 timestamp of last stats sync
}

/**
 * Event entity
 * Represents a local gaming event for a specific domain
 */
export interface Event {
  id: string;
  domainKey: string; // Which domain this event belongs to
  name: string; // Event name
  description: string; // Event description
  venue: string; // Venue name or address
  dateTime: string; // ISO 8601 timestamp
  latitude: number; // Event location latitude
  longitude: number; // Event location longitude
  link: string | null; // Optional external link for more info
  organizerName: string | null; // Optional organizer name
}

/**
 * SharePayload entity
 * Data structure for QR code and NFC sharing
 * Contains only public profile information, no sensitive data
 */
export interface SharePayload {
  type: 'domain-profile'; // Share type identifier
  shareSlug: string; // Unique slug for public profile
  domainKey: string; // Which domain is being shared
  displayName: string; // User's display name
  platformUsername: string; // Username on the platform
  shareUrl: string; // Full public URL to view this profile
  timestamp: string; // ISO 8601 timestamp when share was created
}
