export interface AirQuality {
  ts: Date;
  aqius: number;
  mainus: string;
  aqicn: number;
  maincn: string;
}

export interface Response {
  result: {
    pollution: AirQuality;
  };
}
