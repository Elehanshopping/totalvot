
export interface Candidate {
  name: string;
  party: string;
  votes: number;
  symbol: string;
  isLeading: boolean;
}

export interface ConstituencyResult {
  constituencyName: string;
  constituencyNo: string;
  totalCenters: number;
  centersCounted: number;
  candidates: Candidate[];
  status: 'Published' | 'Counting' | 'Pending';
}

export interface NationalSummary {
  totalSeats: number;
  resultsPublished: number;
  partyStandings: {
    party: string;
    seatsWon: number;
    seatsLeading: number;
    color: string;
  }[];
}

export interface ElectionData {
  summary: NationalSummary;
  featuredResults: ConstituencyResult[];
  lastUpdated: string;
}
