export class CustomTrainValidators {
  static validateTrainId(trainId: any): string | null {
    if (trainId === null || trainId === undefined || trainId === '') return 'Train ID is required.';
    if (isNaN(Number(trainId))) return 'Train ID must be a number.';
    return null;
  }

  static validateName(name: string): string | null {
    if (!name || !name.trim()) return 'Train Name is required.';
    return null;
  }

  static validateSource(source: string): string | null {
    if (!source || !source.trim()) return 'Source is required.';
    return null;
  }

  static validateDestination(destination: string): string | null {
    if (!destination || !destination.trim()) return 'Destination is required.';
    return null;
  }

  static validateDate(date: string): string | null {
    if (!date) return 'Date is required.';
    
    return null;
  }

  static validateTime(time: string): string | null {
    if (!time || !time.trim()) return 'Time is required.';
    return null;
  }

  static validateTotalSeats(totalSeats: any): string | null {
    if (totalSeats === null || totalSeats === undefined || totalSeats === '') return 'Total Seats is required.';
    if (isNaN(Number(totalSeats))) return 'Total Seats must be a number.';
    return null;
  }
}
