/**
 * Event Factory
 *
 * Generates 5-10 mock events per domain with realistic data (names, dates, venues, coordinates).
 * Events are placed near San Francisco (37.7749, -122.4194) for testing.
 * Based on research.md specifications.
 */

import { SeededRandom } from './seededRandom';
import type { Event } from '../../types/entities';

export interface MockEventOptions {
  /** Override event ID */
  id?: string;
  /** Override domain ID */
  domainId?: string;
  /** Specify how many events to generate */
  count?: number;
}

export class EventFactory {
  private rng: SeededRandom;

  // San Francisco base coordinates (per research.md)
  private readonly BASE_LAT = 37.7749;
  private readonly BASE_LNG = -122.4194;
  private readonly RADIUS_KM = 30; // 30km radius

  constructor(seed?: number) {
    this.rng = seed !== undefined ? new SeededRandom(seed) : new SeededRandom(20250101);
  }

  /**
   * Generate 5-10 mock events for a domain (per clarification)
   */
  generateEventsForDomain(domainId: string, count: number = 8): Event[] {
    const events: Event[] = [];

    for (let i = 0; i < count; i++) {
      events.push(this.generateEvent(domainId, i));
    }

    return events.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }

  /**
   * Generate a single event
   */
  private generateEvent(domainId: string, index: number): Event {
    const eventNames = this.getEventNamesForDomain(domainId);
    const venues = this.getVenuesNearSanFrancisco();

    const name = this.rng.pick(eventNames);
    const venue = this.rng.pick(venues);
    const { lat, lng } = this.generateCoordinatesNearBase();
    const eventDate = this.generateUpcomingDate(index);

    return {
      id: `mock-event-${domainId}-${index}`,
      domainKey: domainId,
      name: `${name} #${index + 1}`,
      description: `Join us for ${name} at ${venue.name}. All skill levels welcome!`,
      venue: venue.name,
      dateTime: eventDate.toISOString(),
      latitude: lat,
      longitude: lng,
      link: `https://example.com/events/${domainId}/${index}`,
      organizerName: 'Gaming Community Org',
    };
  }

  /**
   * Get event names specific to domain
   */
  private getEventNamesForDomain(domainId: string): string[] {
    switch (domainId) {
      case 'mock-chess':
        return [
          'Bay Area Chess Championship',
          'Blitz Chess Tournament',
          'SF Open Chess League',
          'Grand Prix Qualifier',
          'Rapid Chess Masters',
        ];
      case 'mock-valorant':
        return [
          'Valorant Pro Series',
          'Agent Showdown',
          'Bay Area Clash',
          'Tactical Shooters Cup',
          'Regional Qualifiers',
        ];
      case 'mock-speedrunning':
        return [
          'GDQ Satellite Event',
          'Any% Speedrun Marathon',
          'Glitchless Championship',
          'Speedrunning Showcase',
          'World Record Attempt',
        ];
      default:
        return ['Gaming Tournament', 'Competitive Event', 'Community Meetup'];
    }
  }

  /**
   * Get venues near San Francisco
   */
  private getVenuesNearSanFrancisco() {
    return [
      {
        name: 'Moscone Center',
        address: '747 Howard St',
        city: 'San Francisco',
        zipCode: '94103',
      },
      {
        name: 'SF Gaming Lounge',
        address: '1234 Market St',
        city: 'San Francisco',
        zipCode: '94102',
      },
      {
        name: 'Berkeley Esports Arena',
        address: '2600 Bancroft Way',
        city: 'Berkeley',
        zipCode: '94720',
      },
      {
        name: 'Oakland Convention Center',
        address: '550 10th St',
        city: 'Oakland',
        zipCode: '94607',
      },
      {
        name: 'San Jose Tech Hub',
        address: '150 W San Carlos St',
        city: 'San Jose',
        zipCode: '95113',
      },
    ];
  }

  /**
   * Generate coordinates near San Francisco within 30km radius
   */
  private generateCoordinatesNearBase(): { lat: number; lng: number } {
    // Simple circle point generation
    const angle = this.rng.nextFloat(0, 2 * Math.PI);
    const radius = this.rng.nextFloat(0, this.RADIUS_KM);

    // Convert km to degrees (rough approximation)
    const latOffset = (radius / 111) * Math.cos(angle);
    const lngOffset = (radius / (111 * Math.cos(this.BASE_LAT * (Math.PI / 180)))) * Math.sin(angle);

    return {
      lat: parseFloat((this.BASE_LAT + latOffset).toFixed(6)),
      lng: parseFloat((this.BASE_LNG + lngOffset).toFixed(6)),
    };
  }

  /**
   * Generate upcoming date (1-90 days in the future)
   */
  private generateUpcomingDate(offset: number): Date {
    const daysInFuture = 7 + offset * 10; // Spread events over next 3 months
    const date = new Date();
    date.setDate(date.getDate() + daysInFuture);
    date.setHours(this.rng.nextInt(9, 20), 0, 0, 0); // Events between 9 AM and 8 PM
    return date;
  }
}

/**
 * Global singleton factory
 */
export const eventFactory = new EventFactory();
