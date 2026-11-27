/** Shared infrastructure ports used by domain services. */
export interface Clock {
  now(): Date;
}

export interface IdGenerator {
  next(): string;
}
