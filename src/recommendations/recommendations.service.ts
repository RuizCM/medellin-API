import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from '../places/place.entity';
import { User } from '../users/user.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Place)
    private placesRepository: Repository<Place>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getRecommendations(userId: string): Promise<Place[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const places = await this.placesRepository.find({ where: { isActive: true } });

    if (!user || !user.preferences) {
      return places.slice(0, 10);
    }

    const scored = places.map(place => ({
      place,
      score: this.calculateScore(place, user.preferences),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.map(item => item.place);
  }

  private calculateScore(place: Place, preferences: User['preferences']): number {
    let score = 0;

    if (preferences.placeType && preferences.placeType.includes(place.category)) {
      score += 40;
    }

    if (preferences.budget) {
      if (preferences.budget === place.priceRange) {
        score += 30;
      }
    }

    if (preferences.ambiente && place.ambiente) {
      const matches = preferences.ambiente.filter(a => place.ambiente.includes(a));
      score += matches.length * 15;
    }

    return score;
  }
}