export interface IClientState {
    //Number is fine for representing timestamp - Universe will be dead by the time it overflows milliseconds.
    sys_timestamp: number;
    [x: string]: number | number[] | string;
}
